import {  ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';

export default class DrawNeighborGenes {
    private d3: D3;
    private parentNativeElement: any;
    private d3Element: Selection<HTMLBaseElement, any, null, undefined>;
    private d3Svg: Selection<SVGSVGElement, any, null, undefined>; 

    //Figure
    private svgWidth: number = 2000;
    private svgHeight: number = 500;
    private clusterFrameHeight = this.svgHeight*0.4;
    static readonly yTranslationOfSvg = 95;
    static readonly frameRectXRadius = 7;
    static readonly frameRectYRadius = 7;

    //Gene cluster
    static readonly directGeneFigureTopY = 20;
    static readonly geneFigureWidth = 30;
    static readonly directGeneFigureBottomY = DrawNeighborGenes.directGeneFigureTopY + DrawNeighborGenes.geneFigureWidth;
    static readonly directGeneFigureMiddlePointY = DrawNeighborGenes.directGeneFigureTopY + DrawNeighborGenes.geneFigureWidth*0.5;
    static readonly reverseGeneFigureTopY = DrawNeighborGenes.directGeneFigureBottomY+30;
    static readonly reverseGeneFigureBottomY = DrawNeighborGenes.reverseGeneFigureTopY + DrawNeighborGenes.geneFigureWidth;
    static readonly reverseGeneFigureMiddlePointY = DrawNeighborGenes.reverseGeneFigureTopY + DrawNeighborGenes.geneFigureWidth*0.5;
    static readonly yTranslationOfGenes = 35;
    static readonly geneFigureArrowLen = 10;
    static readonly fillColour = 'white';
    static readonly borderColour = 'green';
    static readonly currentGeneColour = "#00cc66";

    //Gene info box
    static readonly infoBoxWidth = 300;
    private infoBoxHeight = this.svgHeight*0.3;
    static readonly infoBoxRectXRadius = 3;
    static readonly infoBoxRectYRadius = 3;
    static readonly directGeneInfoBoxY = DrawNeighborGenes.directGeneFigureTopY-148;
    static readonly reverseGeneInfoBoxY = DrawNeighborGenes.reverseGeneFigureTopY-150;
    static readonly textPositionFactorDirect = 0.81;
    static readonly textPositionFactorReverse = 0.87;

    constructor(element: ElementRef, d3Service: D3Service) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    setSvgSize(svgWidth: number, svgHeight: number = null) {
        this.svgWidth = svgWidth != null ? svgWidth : this.svgWidth;
        this.svgHeight = svgHeight != null ? svgHeight : this.svgHeight;
    }

    removeElement(htmlElement) {
        let d3ParentElement = this.d3.select(this.parentNativeElement);
        let d3Element = d3ParentElement.select<HTMLBaseElement>(htmlElement);
        d3Element.selectAll("g").remove();
    }

    drawNeighborGenes(htmlElement, gene: any, neighbGenes: any[]) {
        let d3 = this.d3;
        let svgWidth = this.svgWidth;
        let svgHeight = this.svgHeight;
        let d3ParentElement = d3.select(this.parentNativeElement);
        this.d3Svg = d3ParentElement.select<SVGSVGElement>(htmlElement);
        this.d3Svg.attr('width', svgWidth);
        this.d3Svg.attr('height', svgHeight);

        let genomeNeighbStart = neighbGenes[0].start;
        let genomeNeighbStop = neighbGenes[neighbGenes.length-2].stop;
        let geneScale = this.d3.scaleLinear()
        .domain([genomeNeighbStart, genomeNeighbStop])
        .range([0, svgWidth]);

        let containerGroup = this.d3Svg.append("g").attr("transform", `translate(0,${DrawNeighborGenes.yTranslationOfSvg})`);
        let geneCluster = this.createFrameAndAppendGroupTags(containerGroup, [...neighbGenes, gene]);
        this.createGenePaths(geneCluster, gene, genomeNeighbStop, geneScale);
        this.createDescriptionBoxes(geneCluster, geneScale);
        //Add axis
        containerGroup.append("g").attr("class", "gene-axis")
        .attr("transform", `translate(0,${DrawNeighborGenes.yTranslationOfSvg})`)
        .call(d3.axisBottom(geneScale).ticks(11));
        //create divs with gene descriptions
        let divs = this.addHtml([...neighbGenes, gene], d3ParentElement, geneScale);
        this.addEventListeneres(geneCluster, d3, geneScale);
        this.addHtmlEventListeneres(divs, d3, geneScale);
    }

    private addHtml(neighbourGenes, d3ParentElement, geneScale) {
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

    private createFrameAndAppendGroupTags(containerGroup, neighbourGenes) {
        let svgWidth = this.svgWidth;
        let clusterFrameHeight = this.clusterFrameHeight;
        containerGroup.append("rect")
        .attr("transform", "translate(0,0)")
        .attr("fill-opacity", "0.00")
        .attr("stroke", "gray")
        .attr("stroke-width", 2)
        .attr("rx", DrawNeighborGenes.frameRectXRadius)
        .attr("ry", DrawNeighborGenes.frameRectYRadius)
        .attr('width', svgWidth)
        .attr('height', clusterFrameHeight);

        return containerGroup.selectAll("g")
        .data(neighbourGenes)
        .enter()
        .append("g")
        .attr("class", function(d) {
            return "gene"+d.id;
        })
        .attr("transform", function(d) {
            return `translate(0, ${DrawNeighborGenes.yTranslationOfGenes})`;
        });
    }

    private createGenePaths(geneCluster, thisgene, genomeNeighbStop, geneScale) {
        let prevEnd = null;
        let geneStart;
        let geneStop;
        let genePath;

        geneCluster.append("path")
        .attr("d", function(gene, i) {
        let isComplement = gene.strand === "-" ? true : false;
        if (!isComplement) {
            genePath = [
                `M${geneScale(gene.start)}`, DrawNeighborGenes.directGeneFigureTopY, 
                `L${geneScale(gene.stop)-DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.directGeneFigureTopY, 
                `L${geneScale(gene.stop)}`, DrawNeighborGenes.directGeneFigureMiddlePointY, 
                `L${geneScale(gene.stop)-DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.directGeneFigureBottomY, 
                `L${geneScale(gene.start)}`, DrawNeighborGenes.directGeneFigureBottomY, 'Z'
            ].join(" ");
        } else {
            genePath = [
                `M${geneScale(gene.start)}`, DrawNeighborGenes.reverseGeneFigureMiddlePointY, 
                `L${geneScale(gene.start)+DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.reverseGeneFigureTopY, 
                `L${geneScale(gene.stop)}`, DrawNeighborGenes.reverseGeneFigureTopY,
                `L${geneScale(gene.stop)}`, DrawNeighborGenes.reverseGeneFigureBottomY, 
                `L${geneScale(gene.start)+DrawNeighborGenes.geneFigureArrowLen}`, DrawNeighborGenes.reverseGeneFigureBottomY, 'Z'
            ].join(" ");
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

    private createDescriptionBoxes(geneCluster, geneScale) {
        let infoBoxHeight = this.infoBoxHeight;
        geneCluster.append("rect")
        .style("display", "none")
        .attr("class", function(d) {
            return "gene"+d.id;
        })
        .attr('width', DrawNeighborGenes.infoBoxWidth)
        .attr('height', infoBoxHeight)
        .attr("fill-opacity", "1")
        .attr("fill", "white")
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("rx", DrawNeighborGenes.infoBoxRectXRadius)
        .attr("ry", DrawNeighborGenes.infoBoxRectYRadius)
        .attr("x", function(gene) {
            return geneScale(gene.start);
        })
        .attr("y", function(gene) {
        let isComplement = gene.strand === "-" ? true : false;
        if (!isComplement)
            return DrawNeighborGenes.directGeneInfoBoxY;
        return DrawNeighborGenes.reverseGeneInfoBoxY;
        });
    }

    private addEventListeneres(geneCluster, d3, geneScale) {
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

    private addHtmlEventListeneres(divs, d3, geneScale) {
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