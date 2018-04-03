import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawProteinFeature from '../../core/common/drawSvg/draw-protein-feature';
import AseqViewModel from './aseq.view.model';

@Component({
    selector: 'mist-aseq-view',
    templateUrl: './aseq.view.pug',
    styleUrls: ['./aseq.view.scss']
  })
export class AseqViewComponent implements OnInit {
    private htmlElement: string = "div.domains";
    @Input() private gene$: Observable<any>;
    private aseqViewModel: AseqViewModel;
    private details: boolean = false;
    private arrowObject = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
    private arrow = "keyboard_arrow_downc";


    
    constructor(private elementRef: ElementRef, private d3Service: D3Service) {
    }

    ngOnInit() {
        let drawProteinFeature = new DrawProteinFeature(this.elementRef, this.d3Service);
        this.gene$.skip(1).take(1).subscribe(result => {
            if (result && result.Aseq) {
                this.aseqViewModel = new AseqViewModel(result.Aseq);
                drawProteinFeature.drawProteinFeature(this.htmlElement, [result.Aseq]);
            }
        });
    }

    getInfo(dataType: string) {
        if (dataType && this.aseqViewModel) {
            this.aseqViewModel.changeActiveHeaders(dataType);
            this.aseqViewModel.changeActiveProperties(dataType);
        }
    }

    showDetails() {
        this.details = !this.details;
        this.arrow = this.arrowObject[+this.details];
    }
}