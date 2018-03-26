import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawNeighborGenes from '../../core/common/drawSvg/draw-negihbor-genes';

@Component({
    selector: 'mist-neighbor-genes-view',
    templateUrl: './neighbor-genes.view.pug',
    styleUrls: ['./neighbor-genes.view.scss']
  })
export class NeighborGenesView implements OnInit {
    @Input() private gene$: Observable<any>;
    @Input() private neighbourGenes$: Observable<any>;
    private htmlElement: string = "svg.geneCluster";
    
    constructor(private elementRef: ElementRef, private d3Service: D3Service) {
    }

    ngOnInit() {
        let drawNeighborGenesObject = new DrawNeighborGenes(this.elementRef, this.d3Service);
        this.gene$.skip(1).take(1).subscribe(gene => gene && gene.length > 0 ? this.checkNeighbourGenesAndDraw(gene, drawNeighborGenesObject) : null)
    }
    
    checkNeighbourGenesAndDraw(gene, drawNeighborGenesObject) {
        this.neighbourGenes$.skip(1).take(1).subscribe(neighbGenes => 
            neighbGenes && neighbGenes.length > 0 ? drawNeighborGenesObject.drawNeighborGenes(this.htmlElement, gene, neighbGenes) : null)
    }
}