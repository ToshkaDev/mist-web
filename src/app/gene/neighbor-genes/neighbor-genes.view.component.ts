import { Component, OnInit, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
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
    private thisGene: any;
    private theseNeighbourGenes: any[];
    private drawNeighborGenesObject: DrawNeighborGenes;
    static readonly minSvgWidth = 650;
    static readonly svgWidthToScreenWidthFactor = 0.94;
    
    constructor(private elementRef: ElementRef, private d3Service: D3Service, private renderer: Renderer2) {
    }

    ngOnInit() {
        let geneClusterSvgWidth = (window.innerWidth > 0) 
            ? window.innerWidth*NeighborGenesView.svgWidthToScreenWidthFactor
            : screen.width*NeighborGenesView.svgWidthToScreenWidthFactor;
        geneClusterSvgWidth = geneClusterSvgWidth > NeighborGenesView.minSvgWidth 
            ? geneClusterSvgWidth 
            : NeighborGenesView.minSvgWidth;

        DrawNeighborGenes.svgWidth = geneClusterSvgWidth;
        this.drawNeighborGenesObject = new DrawNeighborGenes(this.elementRef, this.d3Service);
        this.gene$.skip(1).take(1).subscribe(gene => {
            if (gene && gene.length > 0) {
                this.thisGene = gene;
                this.checkNeighbourGenesAndDraw(gene, this.drawNeighborGenesObject);
            }
        });
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(ev) {
        console.log('resized', ev);
        let geneClusterSvgWidth = (window.innerWidth > 0) 
            ? window.innerWidth*NeighborGenesView.svgWidthToScreenWidthFactor
            : screen.width*NeighborGenesView.svgWidthToScreenWidthFactor;
        geneClusterSvgWidth = geneClusterSvgWidth > NeighborGenesView.minSvgWidth 
            ? geneClusterSvgWidth 
            : NeighborGenesView.minSvgWidth;

        this.drawNeighborGenesObject.removeElement(this.htmlElement);
        DrawNeighborGenes.svgWidth = geneClusterSvgWidth;
        this.drawNeighborGenesObject.drawNeighborGenes(this.htmlElement, this.thisGene, this.theseNeighbourGenes);
    }

    checkNeighbourGenesAndDraw(gene, drawNeighborGenesObject) {
        this.neighbourGenes$.skip(1).take(1).subscribe(neighbGenes => {
            if (neighbGenes && neighbGenes.length > 0) {
                this.theseNeighbourGenes = neighbGenes;
                drawNeighborGenesObject.drawNeighborGenes(this.htmlElement, gene, neighbGenes);
            }
        });
    }
}