import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawProteinFeature from '../../core/common/drawSvg/draw-protein-feature';
import { AseqViewModel } from './aseq.view.model';

@Component({
    selector: 'mist-aseq',
    templateUrl: './aseq.pug',
    styleUrls: ['./aseq.scss']
  })
export class AseqComponent implements OnInit {
    private htmlElement: string = "div.domains";
    @Input() private gene$: Observable<any>;
    private aseqViewModel: AseqViewModel;
    private details: boolean = false;
    readonly arrowObject = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
    private arrow = "keyboard_arrow_downc";
    readonly buttonColor = 'white';
    readonly selectedButtonColor = '#28b8bd';
    readonly buttonTextColor = '#197477';
    readonly selectedButtonTextColor = 'white';
    private buttonStyle = {'background-color': this.buttonColor, 'color': this.buttonTextColor};
    private styles = {
        'pfam': {...this.buttonStyle}, 
        'lowComplSegs': {...this.buttonStyle},
        'coiledCoils': {...this.buttonStyle},
        'tmHmm': {...this.buttonStyle},
        'sequence': {...this.buttonStyle}
    };
    static readonly minSvgWidth = 100;
    static readonly svgWidthToScreenWidthFactor = 0.33;
    private drawProteinFeature: DrawProteinFeature;
    private aseqData: any;
    private currentSelection;

    constructor(private elementRef: ElementRef, private d3Service: D3Service) {
    }

    ngOnInit() {
        this.drawProteinFeature = new DrawProteinFeature(this.elementRef, this.d3Service);
        let svgWidth = this.getSvgWidth();
        this.drawProteinFeature.setSvgSize(svgWidth);
        this.gene$.skip(1).take(1).subscribe(result => {
            if (result && result.Aseq) {
                this.aseqViewModel = new AseqViewModel(result.Aseq);
                this.drawProteinFeature.drawProteinFeature(this.htmlElement, [result.Aseq]);
                this.aseqData = result.Aseq;
                this.setProteinFeaturesEventListeners();
            }
        });
    }

    // Get coordinates in the string with added newline characters: one which precedes the string and others after every 60 symbols
    private getTranslatedCoordinates(coordinate: number) {
        if (coordinate <= 59) 
            return ++coordinate;
        else if (coordinate > 59) 
            return coordinate+2;
    }

    getInfo(dataType: string) {
        if (dataType && this.aseqViewModel) {
            for (let element in this.styles) {
                this.styles[element]['background-color'] = this.buttonColor;
                this.styles[element]['color'] = this.buttonTextColor;
            }
            this.styles[dataType]['background-color'] = this.selectedButtonColor;
            this.styles[dataType]['color'] = this.selectedButtonTextColor;
            this.aseqViewModel.changeActiveHeaders(dataType);
            this.aseqViewModel.changeActiveProperties(dataType);
        }
    }

    toggleDetails(show: boolean = false) {
        show ? this.details = true : this.details = !this.details;
        this.arrow = this.arrowObject[+this.details];
    }

    highlightSelection() {
        let protSeqElement = document.getElementsByClassName("protSeq")[0];
        if (this.currentSelection)
            protSeqElement.innerHTML = this.currentSelection;
    }

    setProteinFeaturesEventListeners() {
        let AseqComponentObject = this;
        let sequenceFirstFragment;
        let sequenceMiddleFragment;
        let sequenceLastFragment;
        let proteinSequnce = this.aseqViewModel.getSequence();
        let proteinElements = document.getElementsByClassName("protein-element");
       
        for (let i = 0; i < proteinElements.length; i++) {
            proteinElements[i].addEventListener("click", function(){
                AseqComponentObject.getInfo('sequence');
                AseqComponentObject.toggleDetails(true);
                
                let elementCoords = proteinElements[i].id.split("@")[1].split("-");
                let elementStart = AseqComponentObject.getTranslatedCoordinates(+elementCoords[0]);
                let elementEnd = AseqComponentObject.getTranslatedCoordinates(+elementCoords[1]);

                sequenceFirstFragment = (''+proteinSequnce).substring(0, elementStart);
                sequenceMiddleFragment = '<span style="background-color: yellow">'+(''+proteinSequnce).substring(elementStart, elementEnd+1)+'</span>';
                sequenceLastFragment = (''+proteinSequnce).substring(elementEnd+1, proteinSequnce.length+1);                
                AseqComponentObject.currentSelection = sequenceFirstFragment+sequenceMiddleFragment+sequenceLastFragment;
            });
        }
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        let svgWidth = this.getSvgWidth();
        this.drawProteinFeature.removeElement(this.htmlElement);
        this.drawProteinFeature.setSvgSize(svgWidth);
        this.drawProteinFeature.drawProteinFeature(this.htmlElement, [this.aseqData]);
    }

    private getSvgWidth(): number {
        let svgWidth = (window.innerWidth > 0) 
          ? window.innerWidth*AseqComponent.svgWidthToScreenWidthFactor
          : screen.width*AseqComponent.svgWidthToScreenWidthFactor;
        return svgWidth > AseqComponent.minSvgWidth 
          ? svgWidth 
          : AseqComponent.minSvgWidth;
      }
}