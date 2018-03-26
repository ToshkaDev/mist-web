import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawProteinFeature from '../../core/common/drawSvg/draw-protein-feature';

@Component({
    selector: 'mist-aseq-view',
    templateUrl: './aseq.view.pug',
  })
export class AseqViewComponent implements OnInit {
    @Input() private gene$: Observable<any>;
    private htmlElement: string = "div";
    
    constructor(private elementRef: ElementRef, private d3Service: D3Service) {
    }

    ngOnInit() {
        let drawProteinFeature = new DrawProteinFeature(this.elementRef, this.d3Service);
        this.gene$.skip(1).take(1).subscribe(result => result ? drawProteinFeature.drawProteinFeature(this.htmlElement, [result.Aseq]) : null);
    }
}