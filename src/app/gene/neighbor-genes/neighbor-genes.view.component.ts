import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { D3Service } from 'd3-ng2-service';
import DrawNeighborGenes from '../../core/common/drawSvg/draw-neighbor-genes';

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
    static readonly maxSvgWidth = 1900;
    static readonly svgWidthToScreenWidthFactor = 0.94;

    private itemNumber = 1;
    private isDrawn = false;

    constructor(private elementRef: ElementRef, private d3Service: D3Service) {
    }

    ngOnInit() {
        let geneClusterSvgWidth = (window.innerWidth > 0)
            ? window.innerWidth*NeighborGenesView.svgWidthToScreenWidthFactor
            : screen.width*NeighborGenesView.svgWidthToScreenWidthFactor;

        if (geneClusterSvgWidth <= NeighborGenesView.minSvgWidth)
            geneClusterSvgWidth = NeighborGenesView.minSvgWidth;
        else if (geneClusterSvgWidth > 1900)
            geneClusterSvgWidth = 1900;

        this.drawNeighborGenesObject = new DrawNeighborGenes(this.elementRef, this.d3Service);
        this.drawNeighborGenesObject.setSvgSize(geneClusterSvgWidth);
        this.itemNumber = 1;
        this.isDrawn = false;
        this.gene$.skip(1).take(1).subscribe(gene => {
            if (gene && gene.length > 0) {
                this.thisGene = gene;
                this.checkNeighbourGenesAndDraw(gene, this.drawNeighborGenesObject);
            }
        });
    }

    @HostListener('window:resize', ['$event'])
    reRenderGeneNeighbors() {
        let geneClusterSvgWidth = (window.innerWidth > 0)
            ? window.innerWidth*NeighborGenesView.svgWidthToScreenWidthFactor
            : screen.width*NeighborGenesView.svgWidthToScreenWidthFactor;

        if (geneClusterSvgWidth < NeighborGenesView.minSvgWidth)
            geneClusterSvgWidth = NeighborGenesView.minSvgWidth;
        else if (geneClusterSvgWidth > NeighborGenesView.maxSvgWidth)
            geneClusterSvgWidth = NeighborGenesView.maxSvgWidth;

        this.itemNumber = 1;
        this.drawNeighborGenesObject.removeElement(this.htmlElement);
        this.drawNeighborGenesObject.setSvgSize(geneClusterSvgWidth);
        this.drawNeighborGenesObject.drawNeighborGenes(this.htmlElement, this.thisGene, this.theseNeighbourGenes);
    }

    checkNeighbourGenesAndDraw(gene, drawNeighborGenesObject) {
        this.neighbourGenes$.subscribe(neighbGenes => {
            if (this.itemNumber === 1) {
                if (neighbGenes && neighbGenes.length > 0) {
                    this.theseNeighbourGenes = neighbGenes;
                    drawNeighborGenesObject.drawNeighborGenes(this.htmlElement, gene, neighbGenes);
                    this.isDrawn = true;
                }
            } else if (this.itemNumber === 2) {
                if (neighbGenes && neighbGenes.length > 0) {
                    this.theseNeighbourGenes = neighbGenes;
                    if (this.isDrawn) {
                        this.drawNeighborGenesObject.removeElement(this.htmlElement);
                    }
                    drawNeighborGenesObject.drawNeighborGenes(this.htmlElement, gene, neighbGenes);
                }
            }
            this.itemNumber++;
        });
    }
}
