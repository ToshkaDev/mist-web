import { Component, Input, AfterViewChecked, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { D3Service, D3, Selection } from 'd3-ng2-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-gene-view',
  templateUrl: './gene.view.pug',
  styleUrls: ['./gene.view.component.scss']
})
export class GeneViewComponent implements OnInit {
  @Input() gene$: Observable<any>;
  @Input() geneViewModel: any;
  @Input() neighbourGenes$: Observable<any[]>;
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>; 

  readonly svgWidth = 1500;
  readonly svgHeight = 400;
  readonly fillColour = 'white';
  readonly borderColour = 'green';

  readonly directGeneFigureTopY = 20;
  readonly geneFigureWidth = 30;
  readonly directGeneFigureBottomY = this.directGeneFigureTopY + this.geneFigureWidth;
  readonly directGeneFigureMiddlePointY = this.directGeneFigureTopY + this.geneFigureWidth*0.5;
  readonly reverseGeneFigureTopY = this.directGeneFigureBottomY+30;
  readonly reverseGeneFigureBottomY = this.reverseGeneFigureTopY + this.geneFigureWidth;
  readonly reverseGeneFigureMiddlePointY = this.reverseGeneFigureTopY + this.geneFigureWidth*0.5;
  readonly geneFigureArrowLen = 10;

  constructor(element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    if (this.parentNativeElement !== null)
      this.gene$.skip(1).take(1).subscribe(gene => gene && gene.length > 0 ? this.checkNeighbourGenesAndDraw(gene) : null)
  }

  checkNeighbourGenesAndDraw(gene) {
    this.neighbourGenes$.skip(1).take(1).subscribe(neighbGenes => neighbGenes && neighbGenes.length > 0 ? this.drawGenes(gene, neighbGenes) : null)
  }

  drawGenes(gene: any, neighbGenes: any[]) {
    let currentGeneColour = "#00cc66";
    let d3 = this.d3;
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;

    let isComplement: boolean;
    let thisgene = gene;
    let neighbourGenes = [...neighbGenes, thisgene]
    d3ParentElement = d3.select(this.parentNativeElement);
    this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');
    this.d3Svg.attr('width', this.svgWidth);
    this.d3Svg.attr('height', this.svgHeight);
    
    //read only proteprties
    let directGeneFigureTopY = this.directGeneFigureTopY;
    let directGeneFigureMiddlePointY = this.directGeneFigureMiddlePointY;
    let directGeneFigureBottomY = this.directGeneFigureBottomY;
    let reverseGeneFigureTopY = this.reverseGeneFigureTopY;
    let reverseGeneFigureMiddlePointY = this.reverseGeneFigureMiddlePointY;
    let reverseGeneFigureBottomY = this.reverseGeneFigureBottomY;

    let geneFigureArrowLen = this.geneFigureArrowLen;
    let borderColour = this.borderColour;
    let fillColour = this.fillColour;

    let genomeNeighbStart = neighbGenes[0].start;
    let genomeNeighbStop = neighbGenes[neighbGenes.length-2].stop;
    let svgWidth = this.svgWidth;
    let geneScale = this.d3.scaleLinear()
      .domain([genomeNeighbStart, genomeNeighbStop])
      .range([0, svgWidth]);


    //dinamic properties
    let prevEnd = null;
    let geneStart;
    let geneStop;
    let genePath;
  
    let containerGroup = this.d3Svg.append("g").attr("transform", "translate(0,50)");

    containerGroup.append("rect")
    .attr("transform", "translate(0,0)")
    .attr("fill-opacity", "0.00")
    .attr("stroke", "gray")
    .attr("stroke-width", 3)
    .attr("rx", 7)
    .attr("ry", 7)
    .attr('width', 1500)
    .attr('height', 200);

    let geneCluster = containerGroup.selectAll("g")
    .data(neighbourGenes)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(0,35)";
    });

    geneCluster.append("path")
    .attr("d", function(gene, i) {
      isComplement = gene.strand === "-" ? true : false;
      if (geneScale(gene.start) < geneScale(genomeNeighbStop)) {
        if (!isComplement) {
          genePath = [`M${geneScale(gene.start)}`, directGeneFigureTopY, 
            `L${geneScale(gene.stop)-geneFigureArrowLen}`, directGeneFigureTopY, 
            `L${geneScale(gene.stop)}`, directGeneFigureMiddlePointY, 
            `L${geneScale(gene.stop)-geneFigureArrowLen}`, directGeneFigureBottomY, 
            `L${geneScale(gene.start)}`, directGeneFigureBottomY, 'Z'].join(" ")
            //console.log("genePath " + genePath)
        } else {
            genePath = [`M${geneScale(gene.start)}`, reverseGeneFigureMiddlePointY, 
            `L${geneScale(gene.start)+geneFigureArrowLen}`, reverseGeneFigureTopY, 
            `L${geneScale(gene.stop)}`, reverseGeneFigureTopY,
            `L${geneScale(gene.stop)}`, reverseGeneFigureBottomY, 
            `L${geneScale(gene.start)+geneFigureArrowLen}`, reverseGeneFigureBottomY, 'Z'].join(" ")
            //console.log("genePath 2 " + genePath)
        }
      }
      prevEnd = gene.stop;
      return genePath;
    })
    .attr("fill", function(gene){
      if (gene.stable_id === thisgene.stable_id)
        return currentGeneColour;
      return fillColour;
    })
    .attr("stroke", function(gene) {
      return borderColour;
    })
    .attr("class", "gene-path");




    geneCluster.append("rect")
    .attr("display", "none")
    .attr("class", "neighbGeneInfo")
    .attr('width', 200)
    .attr('height', 100)
    .attr("fill-opacity", "1")
    .attr("fill", "white")
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("x", function(gene) {
      return geneScale(gene.start);
    })
    .attr("y", function(gene) {
      isComplement = gene.strand === "-" ? true : false;
      if (!isComplement)
        return directGeneFigureTopY-100;
      return reverseGeneFigureTopY-100;
    });



    //Need to change this thing.
    geneCluster.append("foreignObject")
    .attr('class', 'geneText')
    .attr("display", "none")
    .attr("x", function(gene) {
      return geneScale(gene.start);
    }) 
    .attr("y", function(gene) {
      isComplement = gene.strand === "-" ? true : false;
      if (!isComplement)
        return directGeneFigureTopY-90;
      return reverseGeneFigureTopY-90;
    })
    .attr("stroke", "black")
    .attr("font-size", "12px")
    .attr("font-family", "arial")
    .html(function(gene) {
      return `<div>${gene.stable_id}</div><div>${gene.version}</div><div><a routerLink href="/genes/${gene.stable_id}">${gene.product}</a></div>`;
    });


    // geneCluster.append("text")
    //   .attr('class', 'geneText')
    //   .attr("display", "none")
    //   .attr("x", function(gene) {
    //     return geneScale(gene.start);
    //   }) 
    //   .attr("y", function(gene) {
    //     isComplement = gene.strand === "-" ? true : false;
    //     if (!isComplement)
    //       return directGeneFigureTopY;
    //     return reverseGeneFigureTopY;
    //   })
    //   .attr("stroke", "black")
    //   .attr("font-size", "12px")
    //   .attr("font-family", "arial")
    //   .text(function(gene) {
    //     return gene.version;
    //   });

      geneCluster
      .on("mouseover", function (){
        let element = d3.select(this);
        element.select('.geneText').attr("display", null);
        element.select('.neighbGeneInfo').attr("display", null);
        element.raise();
      })
      .on("mouseout", function(){
        d3.select(this).select('.geneText').attr("display", "none")
        d3.select(this).select('.neighbGeneInfo').attr("display", "none")
      });

      //Add axis
      containerGroup.append("g")
      .attr("transform", "translate(0, 90)")
      .call(d3.axisBottom(geneScale).ticks(11));
  }


}


