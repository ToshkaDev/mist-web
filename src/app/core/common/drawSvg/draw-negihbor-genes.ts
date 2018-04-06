import {  ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';

export default class DrawNeighborGenes {
    private d3: D3;
    private parentNativeElement: any;
    private d3Element: Selection<HTMLBaseElement, any, null, undefined>;
    private d3Svg: Selection<SVGSVGElement, any, null, undefined>; 

    static readonly svgWidth = 1500;
    static readonly svgHeight = 500;
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
    static readonly textPositionFactorDirect = 0.81;
    static readonly textPositionFactorReverse = 0.87;

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


        let containerGroup = this.d3Svg.append("g").attr("transform", "translate(0,95)");
        let geneCluster = this.createFrameAndAppendGroupTags(containerGroup, [...neighbGenes, gene]);
        this.createGenePaths(geneCluster, gene, genomeNeighbStop, geneScale);
        this.createDescriptionBoxes(geneCluster, geneScale);
        //Add axis
        containerGroup.append("g").attr("class", "gene-axis")
        .attr("transform", "translate(0, 90)")
        .call(d3.axisBottom(geneScale).ticks(11));
        //create divs with gene descriptions
        let divs = this.addHtml([...neighbGenes, gene], d3ParentElement, geneScale);
        this.addEventListeneres(geneCluster, d3, geneScale);
        this.addHtmlEventListeneres(divs, d3, geneScale);
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
        .html(function(gene) {
            let format = gene.strand === "-" ? "complement(coords)" : "(coords)";
            let geneCoordinates = format.replace("coords", gene.start + ".." + gene.stop);
            return `<div><a routerLink href="/genes/${gene.stable_id}">${gene.stable_id}</a></div>` + 
            `<div>${gene.version}</div><div>${geneCoordinates}</div>` + 
            `<div>${gene.product}<div/>`;
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
        .attr("class", function(d) {
            return "gene"+d.id;
        })
        .attr('width', 300)
        .attr('height', 150)
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
            return DrawNeighborGenes.directGeneFigureTopY-148;
        return DrawNeighborGenes.reverseGeneFigureTopY-150;
        });
    }

    addEventListeneres(geneCluster, d3, geneScale) {
        geneCluster
        .on("mouseover", function (){
            let element = d3.select(this);
            let axisElem = document.getElementsByClassName('gene-axis')[0].getBoundingClientRect();
            let top, left, xAbsolute = axisElem["x"] + window.scrollX, yAbsolute = axisElem["y"] + window.scrollY;
            element.attr("dummy", function(gene){
                let isComplement = gene.strand === "-" ? true : false;
                if (!isComplement)
                    top = DrawNeighborGenes.textPositionFactorDirect*yAbsolute + "px;";
                else top = DrawNeighborGenes.textPositionFactorReverse*yAbsolute + "px;";
                console.log("geneScale(gene.start) " + geneScale(gene.start));
                console.log("xAbsolute " + xAbsolute);
                left = geneScale(gene.start) + xAbsolute + "px;";
            });

            let elementsOfTheClass = document.getElementsByClassName(element.attr("class"));
            let textDiv = elementsOfTheClass[2];
            let textDivStyles = textDiv.getAttribute("style").replace("display: none","display: inline");       
            
            let regTop = /top: \d+.+px;/;
            let regLeft = /left: \d+.+px;/;
            regTop.test(textDivStyles) 
                ? textDivStyles = textDivStyles.replace(regTop, "top: " + top) 
                : textDivStyles = textDivStyles + "top: " + top; 
                
            regLeft.test(textDivStyles) 
                ? textDivStyles = textDivStyles.replace(regLeft, "top: " + top)
                : textDivStyles = textDivStyles + "left: " + left;

            textDiv.setAttribute("style", textDivStyles);
            let descripRect = elementsOfTheClass[1];
            let descripRectStyles = descripRect.getAttribute("style").replace("display: none","display: inline");
            descripRect.setAttribute("style", descripRectStyles);

            element.raise();
        })
        .on("mouseout", function(){
            let element = d3.select(this);
            let elementsOfTheClass = document.getElementsByClassName(element.attr("class"));

            let textDiv = elementsOfTheClass[2];
            let textDivStyles = textDiv.getAttribute("style").replace("display: inline","display: none");
            textDiv.setAttribute("style", textDivStyles);

            let descripRect = elementsOfTheClass[1];
            let descripRectStyles = descripRect.getAttribute("style").replace("display: inline","display: none");
            descripRect.setAttribute("style", descripRectStyles);
        });
    }

    addHtmlEventListeneres(divs, d3, geneScale) {
        divs
        .on("mouseover", function (){
            let element = d3.select(this);
            let axisElem = document.getElementsByClassName('gene-axis')[0].getBoundingClientRect();
            let xAbsolute = axisElem["x"] + window.scrollX, yAbsolute = axisElem["y"] + window.scrollY;
            
            element
            .style("top", function(gene) {
                let isComplement = gene.strand === "-" ? true : false;
                if (!isComplement)
                    return DrawNeighborGenes.textPositionFactorDirect*yAbsolute + "px";
                return DrawNeighborGenes.textPositionFactorReverse*yAbsolute + "px";
            })
            .style("left", function(gene) {
                return geneScale(gene.start) + xAbsolute + "px";
            })
            .style("display", "inline");

            let elementsOfTheClass = document.getElementsByClassName(element.attr("class"));
            let descripRect = elementsOfTheClass[1];
            let descripRectStyles = descripRect.getAttribute("style").replace("display: none","display: inline");
            descripRect.setAttribute("style", descripRectStyles);
            element.raise();
        })
        .on("mouseout", function(){
            let element = d3.select(this);
            element.style("display", "none");

            let elementsOfTheClass = document.getElementsByClassName(element.attr("class"));
            let descripRect = elementsOfTheClass[1];
            let descripRectStyles = descripRect.getAttribute("style").replace("display: inline","display: none");
            descripRect.setAttribute("style", descripRectStyles);
        });
    }

}