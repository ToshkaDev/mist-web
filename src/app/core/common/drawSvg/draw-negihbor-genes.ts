import {  ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';

export default class DrawNeighborGenes {
    private d3: D3;
    private parentNativeElement: any;
    private d3Element: Selection<HTMLBaseElement, any, null, undefined>;
    private d3Svg: Selection<SVGSVGElement, any, null, undefined>; 

    static readonly svgWidth = 1500;
    static readonly svgHeight = 400;
    static readonly fillColour = 'white';
    static readonly borderColour = 'green';
    static readonly currentGeneColour = "#00cc66";
  
    static readonly directGeneFigureTopY = 20;
    static readonly geneFigureWidth = 30;
    static readonly directGeneFigureBottomY = DrawNeighborGenes.directGeneFigureTopY + DrawNeighborGenes.geneFigureWidth;
    static readonly directGeneFigureMiddlePointY = DrawNeighborGenes.directGeneFigureTopY + DrawNeighborGenes.geneFigureWidth*0.5;
    static readonly reverseGeneFigureTopY = DrawNeighborGenes.directGeneFigureBottomY+30;
    static readonly reverseGeneFigureBottomY = DrawNeighborGenes.reverseGeneFigureTopY + DrawNeighborGenes.geneFigureWidth;
    static readonly reverseGeneFigureMiddlePointY = DrawNeighborGenes.reverseGeneFigureTopY + DrawNeighborGenes.geneFigureWidth*0.5;
    static readonly geneFigureArrowLen = 10;

    constructor(element: ElementRef, d3Service: D3Service) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    drawNeighborGenes(htmlElement, gene: any, neighbGenes: any[]) {
        let d3 = this.d3;
        let d3ParentElement = d3.select(this.parentNativeElement);
        this.d3Svg = d3ParentElement.select<SVGSVGElement>(htmlElement);
        this.d3Svg.attr('width', DrawNeighborGenes.svgWidth);
        this.d3Svg.attr('height', DrawNeighborGenes.svgHeight);

        let genomeNeighbStart = neighbGenes[0].start;
        let genomeNeighbStop = neighbGenes[neighbGenes.length-2].stop;
        let geneScale = this.d3.scaleLinear()
        .domain([genomeNeighbStart, genomeNeighbStop])
        .range([0, DrawNeighborGenes.svgWidth]);


        let containerGroup = this.d3Svg.append("g").attr("transform", "translate(0,50)");
        let geneCluster = this.createFrameAndAppendGroupTags(containerGroup, [...neighbGenes, gene]);
        this.createGenePaths(geneCluster, gene, genomeNeighbStop, geneScale);
        this.createDescriptionBoxes(geneCluster, geneScale);
        //Add axis
        containerGroup.append("g").attr("class", "gene-axis")
        .attr("transform", "translate(0, 90)")
        .call(d3.axisBottom(geneScale).ticks(11));
        //create divs with gene descriptions
        let divs = this.addHtml([...neighbGenes, gene], d3ParentElement, geneScale);
        this.addEventListeneres(geneCluster, d3);
        
    }

    addHtml(neighbourGenes, d3ParentElement, geneScale) {
        let axisElem = document.getElementsByClassName('gene-axis')[0].getBoundingClientRect();
        let xAbsolute = axisElem["x"] + window.scrollX;
        let yAbsolute = axisElem["y"] + window.scrollY;
       
        let divs = d3ParentElement
        .selectAll("div")
        .data(neighbourGenes)
        .enter()
        .append('div')
        .style("display", "none")
        .style("position", "absolute")
        .attr("class", function(gene) {
            return "gene"+gene.id;
        })
        .style("top", function(gene) {
            let isComplement = gene.strand === "-" ? true : false;
            if (!isComplement)
                return yAbsolute-90 + DrawNeighborGenes.directGeneFigureTopY + "px";
            return yAbsolute-90 + DrawNeighborGenes.reverseGeneFigureTopY + "px";
        })
        .style("left", function(gene) {
            return geneScale(gene.start) + xAbsolute + "px";
        })
        .html(function(d, i) {
            return "<span>" + d.version + "</span>";
        })
        return divs;
    }

    createFrameAndAppendGroupTags(containerGroup, neighbourGenes) {
        containerGroup.append("rect")
        .attr("transform", "translate(0,0)")
        .attr("fill-opacity", "0.00")
        .attr("stroke", "gray")
        .attr("stroke-width", 3)
        .attr("rx", 7)
        .attr("ry", 7)
        .attr('width', 1500)
        .attr('height', 200);

        return containerGroup.selectAll("g")
        .data(neighbourGenes)
        .enter()
        .append("g")
        .attr("class", function(d) {
            return "gene"+d.id;
        })
        .attr("transform", function(d) {
        return "translate(0,35)";
        });
    }


    createGenePaths(geneCluster, thisgene, genomeNeighbStop, geneScale) {
        let prevEnd = null;
        let geneStart;
        let geneStop;
        let genePath;

        geneCluster.append("path")
        .attr("d", function(gene, i) {
        let isComplement = gene.strand === "-" ? true : false;
        if (geneScale(gene.start) < geneScale(genomeNeighbStop)) {
            if (!isComplement) {
            genePath = [
                `M${geneScale(gene.start)}`, DrawNeighborGenes.directGeneFigureTopY, 
                `L${geneScale(gene.stop)-DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.directGeneFigureTopY, 
                `L${geneScale(gene.stop)}`, DrawNeighborGenes.directGeneFigureMiddlePointY, 
                `L${geneScale(gene.stop)-DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.directGeneFigureBottomY, 
                `L${geneScale(gene.start)}`, DrawNeighborGenes.directGeneFigureBottomY, 'Z'
            ].join(" ")
            } else {
                genePath = [
                   `M${geneScale(gene.start)}`, DrawNeighborGenes.reverseGeneFigureMiddlePointY, 
                    `L${geneScale(gene.start)+DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.reverseGeneFigureTopY, 
                    `L${geneScale(gene.stop)}`, DrawNeighborGenes.reverseGeneFigureTopY,
                    `L${geneScale(gene.stop)}`, DrawNeighborGenes.reverseGeneFigureBottomY, 
                    `L${geneScale(gene.start)+DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.reverseGeneFigureBottomY, 'Z'
                ].join(" ")
            }
        }
        prevEnd = gene.stop;
        return genePath;
        })
        .attr("fill", function(gene){
        if (gene.stable_id === thisgene.stable_id)
            return DrawNeighborGenes.currentGeneColour;
        return DrawNeighborGenes.fillColour;
        })
        .attr("stroke", function(gene) {
        return DrawNeighborGenes.borderColour;
        })
        .attr("class", "gene-path");
    }

    createDescriptionBoxes(geneCluster, geneScale) {
        geneCluster.append("rect")
        .style("display", "none")
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
        let isComplement = gene.strand === "-" ? true : false;
        if (!isComplement)
            return DrawNeighborGenes.directGeneFigureTopY-100;
        return DrawNeighborGenes.reverseGeneFigureTopY-100;
        });
    }

    addEventListeneres(geneCluster, d3) {
        geneCluster
        .on("mouseover", function (){
            let element = d3.select(this);
            let elementClass = element.attr("class");
            let affectedDiv = document.getElementsByClassName(elementClass)[1];
            let styles = affectedDiv.getAttribute("style").replace("display: none","display: inline");
            affectedDiv.setAttribute("style", styles);
            element.select('.neighbGeneInfo').style("display", "inline");
            element.raise();
        })
        .on("mouseout", function(){
            let elementClass = d3.select(this).attr("class");
            let affectedDiv = document.getElementsByClassName(elementClass)[1];
            let styles = affectedDiv.getAttribute("style").replace("display: inline","display: none");
            affectedDiv.setAttribute("style", styles);
            d3.select(this).select('.neighbGeneInfo').style("display", "none")
        });
    }

}