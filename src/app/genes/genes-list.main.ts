import { Input, ElementRef, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawProteinFeature from '../core/common/drawSvg/draw-protein-feature';
import { Entities } from '../core/common/entities';
import { MistListComponent } from '../core/common/mist-list-component';
import { CartChangedService } from '../shop-cart/cart-changed.service';
import { ToggleChangedService } from '../core/components/protein-feature-toggle/toggle-changed.service';


export abstract class GenesListMain extends MistListComponent implements OnInit {
  @Input() genes$: Observable<any>; 
  static readonly minSvgWidth = 350;
  //static readonly minSvgWidth = 100;
  static readonly maxSvgWidth = 530;
  static readonly svgWidthToScreenWidthFactor = 0.29;

  private geneToAseq = new Map<string, any>();
  private geneIsDrawn = new Map<string, boolean>();
  private geneToProteinObject = new Map<string, DrawProteinFeature>();

  private htmlElement: string = "div";

  @Input() isLcrChecked = false;
  @Input() isCoiledCoilsChecked = false;
    
  constructor(private elementRef: ElementRef, private d3Service: D3Service, cartChangedService: CartChangedService, private toggleChanegsService: ToggleChangedService, isShopCart: boolean = false) {
    super(cartChangedService, Entities.GENES, isShopCart);
  }
 
  ngOnInit() {
    this.genes$.subscribe(result => {
      if (result && result.length > 0) {
        this.geneToAseq.clear();
        this.geneIsDrawn.clear();
        this.geneToProteinObject.clear();
        for (let gene of result) {
          if (gene.Aseq || (gene.Gene && gene.Gene.Aseq) ) {
            let geneId = gene.Aseq ? gene.id : gene.Gene.id;
            let aseq = gene.Aseq ? gene.Aseq : gene.Gene.Aseq;
            this.geneToAseq.set(geneId, aseq);
            this.geneIsDrawn.set(geneId, false);
          }
        }
      }
    });
    this.toggleChanegsService.lcrChanged$.subscribe(isChecked => {
      this.isLcrChecked = isChecked;
      this.reRenderProteinFeatures()
    });
    this.toggleChanegsService.coiledCoilsChanged$.subscribe(isChecked => {
      this.isCoiledCoilsChecked = isChecked;
      this.reRenderProteinFeatures()
    });
  }

  drawProteinFeature(geneId: string) {
    let svgWidth = this.getSvgWidth();
    let aseqData = this.geneToAseq.get(geneId);
    // !this.geneIsDrawn.get(geneId) is an additional guard preventing repeated rendering
    if (aseqData && !this.geneIsDrawn.get(geneId)) {
      let drawProteinFeature = new DrawProteinFeature(this.elementRef, this.d3Service);
      drawProteinFeature.setSvgSize(svgWidth);
      drawProteinFeature.drawProteinFeature(`${this.htmlElement}.gene${geneId}`, [aseqData], this.isLcrChecked, this.isCoiledCoilsChecked);
      this.geneToProteinObject.set(geneId, drawProteinFeature);
    }
    // Even if something went wrong rendering shouldn't be repeated
    this.geneIsDrawn.set(geneId, true);
  }

  @HostListener('window:resize', ['$event'])
  reRenderProteinFeatures() {
    let svgWidth = this.getSvgWidth();
    this.geneToProteinObject.forEach((proteinObject, geneId) => {
      proteinObject.removeElement(`${this.htmlElement}.gene${geneId}`);
      proteinObject.setSvgSize(svgWidth);
      proteinObject.drawProteinFeature(`${this.htmlElement}.gene${geneId}`, [this.geneToAseq.get(geneId)], this.isLcrChecked, this.isCoiledCoilsChecked);
    })
  }

  private getSvgWidth(): number {
    let svgWidth = (window.innerWidth > 0) 
      ? window.innerWidth*GenesListMain.svgWidthToScreenWidthFactor
      : screen.width*GenesListMain.svgWidthToScreenWidthFactor;

    let svgWidthReady = svgWidth;
    if (svgWidth < GenesListMain.minSvgWidth) 
      svgWidthReady = GenesListMain.minSvgWidth;
    else if (svgWidth > GenesListMain.maxSvgWidth)
      svgWidthReady = GenesListMain.maxSvgWidth;

    return svgWidthReady;
  }
}
