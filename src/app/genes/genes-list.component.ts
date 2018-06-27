import { ChangeDetectionStrategy, Component, Input, ElementRef, OnInit, HostListener } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawProteinFeature from '../core/common/drawSvg/draw-protein-feature';

@Component({
  selector: 'mist-genes-list',
  templateUrl: './genes-list.pug',
  styleUrls: ['./genes-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesListComponent implements OnInit {
  @Input() genes$: Observable<any>; 
  @Input() displayedColumns: String[];
  @Input() genes: DataSource<any>;
  @Input() query: string;
  static readonly minSvgWidth = 100;
  static readonly svgWidthToScreenWidthFactor = 0.33;

  private geneToAseq = new Map<string, any>();
  private geneIsDrawn = new Map<string, boolean>();
  private geneToProteinObject = new Map<string, DrawProteinFeature>();

  private htmlElement: string = "div";
    
  constructor(private elementRef: ElementRef, private d3Service: D3Service) {
  }
 
  ngOnInit() {
    this.genes$.subscribe(result => {
      this.geneToAseq.clear();
      this.geneIsDrawn.clear();
      this.geneToProteinObject.clear();
      for (let gene of result) {
        if (gene.Aseq) {
          this.geneToAseq.set(gene.id, gene.Aseq);
          this.geneIsDrawn.set(gene.id, false);
        }
      }
    });
  }

  drawProteinFeature(geneId: string) {
    let svgWidth = this.getSvgWidth();
    let aseqData = this.geneToAseq.get(geneId);
    // !this.geneIsDrawn.get(geneId) is an additional guard preventing repeated rendering
    if (aseqData && !this.geneIsDrawn.get(geneId)) {
      let drawProteinFeature = new DrawProteinFeature(this.elementRef, this.d3Service);
      drawProteinFeature.setSvgSize(svgWidth);
      drawProteinFeature.drawProteinFeature(`${this.htmlElement}.gene${geneId}`, [aseqData]);
      this.geneToProteinObject.set(geneId, drawProteinFeature);
    }
    // Even if something went wrong rendering shouldn't be repeated
    this.geneIsDrawn.set(geneId, true);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(ev) {
    let svgWidth = this.getSvgWidth();
    this.geneToProteinObject.forEach((proteinObject, geneId) => {
      proteinObject.removeElement(`${this.htmlElement}.gene${geneId}`);
      proteinObject.setSvgSize(svgWidth);
      proteinObject.drawProteinFeature(`${this.htmlElement}.gene${geneId}`, [this.geneToAseq.get(geneId)]);
    })
  }

  private getSvgWidth(): number {
    let svgWidth = (window.innerWidth > 0) 
      ? window.innerWidth*GenesListComponent.svgWidthToScreenWidthFactor
      : screen.width*GenesListComponent.svgWidthToScreenWidthFactor;
    return svgWidth > GenesListComponent.minSvgWidth 
      ? svgWidth 
      : GenesListComponent.minSvgWidth;
  }
}
