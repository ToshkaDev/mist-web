import { ChangeDetectionStrategy, Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawProteinFeature from '../core/common/drawSvg/draw-protein-feature';

@Component({
  selector: 'mist-genes-list',
  templateUrl: './genes-list.pug',
  styleUrls: ['./genes-list.scss']
})
export class GenesListComponent implements AfterViewInit {
  @Input() genes$: Observable<any>; 
  @Input() displayedColumns: String[];  
  @Input() genes: DataSource<any>;
  @Input() query: string;

  private htmlElement: string = "div";
    
  constructor(private elementRef: ElementRef, private d3Service: D3Service) {
  }
 
  ngAfterViewInit() {
      this.genes$.subscribe(result => {
          for (let gene of result) {
            let drawProteinFeature = new DrawProteinFeature(this.elementRef, this.d3Service);
            let aseqData = gene["Aseq"];
            aseqData ? 
              drawProteinFeature.drawProteinFeature(`${this.htmlElement}.gene${gene["id"]}`, [aseqData])
              : null;
          }
      });
  }
}
