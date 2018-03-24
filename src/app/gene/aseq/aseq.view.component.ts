import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import * as fromGenes from '../gene.selectors';
import GeneView from '../gene.view.model';
import DrawProteinFeature from './draw-protein-feature';
import { Aseq } from '../../core/common/aseq';

@Component({
    selector: 'mist-aseq-view',
    templateUrl: './aseq-view.pug',
  })
export class AseqViewComponent implements OnInit {
    @Input() private aseqData$: Observable<any>;
    private htmlElement: string = "div";
    
    constructor(private element: ElementRef, private d3Service: D3Service) {
    }


    ngOnInit() {
        let drawProteinFeature = new DrawProteinFeature(this.element, this.d3Service);
        this.aseqData$.subscribe(result => result ? drawProteinFeature.drawProteinFeature(this.htmlElement, [result]) : null);
    }


}