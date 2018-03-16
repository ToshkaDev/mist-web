import { Component, Input, AfterViewChecked, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import * as DomainGfx from 'domain-gfx';
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
  readonly svgHeight = 200;
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


    // const parent = document.querySelector('.maincontainer');

    // //testing domain-gfx library
    // const data = {
    //   length: 100,
    //   regions: [
    //     {
    //       text: 'domain name',
    //       start: 2,
    //       end: 40,
    //       aliStart: 5,
    //       aliEnd: 30,
    //       display: true,
    //       startStyle: 'jagged',
    //       endStyle: 'curved',
    //       color: 'blue',
    //       metadata: {
    //         database: 'pfam',
    //         description: 'text about the domain',
    //         accession: 'PF00000',
    //         identifier: 'domain X',
    //       },
    //     },
    //   ],
    //   markups: [
    //     {
    //       lineColour: '#0ff0f0',
    //       colour: '#bb5b55',
    //       display: true,
    //       vAlign: 'top',
    //       type: 'Pfam predicted active site',
    //       start: 5,
    //       headStyle: 'diamond',
    //       metadata: {
    //         database: 'pfam',
    //         description: 'S Pfam predicted active site',
    //       },
    //     },
    //   ],
    //   motifs: [
    //     {
    //       colour: '#00a500',
    //       metadata: true,
    //       database: 'Phobius',
    //       type: 'sig_p',
    //       display: true,
    //       end: 50,
    //       start: 30
    //     },
    //   ],
    // };
     
    // const dg = new DomainGfx({data, parent});
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
    
    let containerGroup = this.d3Svg.selectAll("g")
    .data(neighbourGenes)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(0,0)";
    });

    containerGroup.append("path")
    .attr("d", function(gene, i) {
      // console.log("gene.start " + gene.start)
      // console.log("geneStop " + geneStop)
      // console.log("geneScale(geneStart) " + geneScale(gene.start))
      // console.log("geneScale(gene.stop) " + geneScale(gene.stop))


      isComplement = gene.strand === "-" ? true : false;
      //console.log("gene.strand " + gene.strand)
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


    containerGroup.append("text")
      .attr('class', 'myc')
      .attr("display", "none")
      .attr("x", function(gene) {
        return geneScale(gene.start);
      }) 
      .attr("y", function(gene) {
        isComplement = gene.strand === "-" ? true : false;
        if (!isComplement)
          return directGeneFigureMiddlePointY;
        return reverseGeneFigureMiddlePointY;
      })
      .attr("stroke", "black")
      .attr("font-size", "12px")
      .attr("font-family", "arial")
      .text(function(gene) {
        return gene.version;
      });

      containerGroup
      .on("mouseover", function (){
        d3.select(this).select('text').attr("display", null).style("pointer-events", "none")
      })
      .on("mouseout", function(){
        d3.select(this).select('text').attr("display", "none")
      });

      this.d3Svg.append("g")
      .attr("transform", "translate(0, 55)")
      .call(d3.axisBottom(geneScale).ticks(11));
  }

}


