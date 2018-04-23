import {  ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { Aseq } from './aseq';
import { pfamInterface } from './aseq';

export default class DrawProteinFeature {
    private d3: D3;
    private parentNativeElement: any;
    private d3Element: Selection<HTMLBaseElement, any, null, undefined>;

    // Constants
    private kSvgWidth = 500;
    private kSvgHeight = 100;
    static readonly kBackboneHeight = 10;
    static readonly kDomainHeight = 40;
    static readonly kDomainStrokeWidth = 3;
    static readonly kPartialPixel = 3;
    static readonly kTransmembraneHeight = 50;
    static readonly kCoilsHeight = 45;
    static readonly kLcrHeight = 45;
    static readonly kDomainTextMargin = 5;
    static readonly kNameLengthToPixelFactor = 10;
    static readonly kFontFamily = "Verdana";
    static readonly kFontSize = 18;
    static readonly domainColors = {
        "domain"        : "rgba(255,255,255,0.8)",
        "domainStroke"  : "rgba(0,0,0,0.8)",
        "tm"            : "rgba(100,100,100,0.7)",
        "coils"         : "rgba(46,139,87,0.7)",
        "lcr"           : "rgba(199,21,133,0.7)"
    };

    // Computed constants
    private kMiddleY = this.kSvgHeight/2;
    private kBackboneYstart = this.kMiddleY - (DrawProteinFeature.kBackboneHeight/2);
    private kDomainYstart = this.kMiddleY - (DrawProteinFeature.kDomainHeight/2);
    private kDomainYend = this.kMiddleY + (DrawProteinFeature.kDomainHeight/2);
    private kTransmembraneYstart = this.kMiddleY - (DrawProteinFeature.kTransmembraneHeight/2);
    private kCoilsYstart = this.kMiddleY - (DrawProteinFeature.kCoilsHeight/2);
    private kLcrYstart = this.kMiddleY - (DrawProteinFeature.kLcrHeight/2);

    constructor(element: ElementRef, d3Service: D3Service) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    setSvgSize(svgWidth: number, svgHeight: number = null) {
        this.kSvgWidth = svgWidth != null ? svgWidth : this.kSvgWidth;
        this.kSvgHeight = svgHeight != null ? svgHeight : this.kSvgWidth;
    }

    removeElement(htmlElement) {
        let d3ParentElement = this.d3.select(this.parentNativeElement);
        d3ParentElement.selectAll("svg.protein-feature").remove();
    }

    drawProteinFeature(htmlElement, data: Aseq[]) {
        let d3 = this.d3;
        let kSvgWidth = this.kSvgWidth;
        let kSvgHeight = this.kSvgHeight;
        let kBackboneYstart = this.kBackboneYstart;
        let kCoilsYstart = this.kCoilsYstart;
        let kLcrYstart = this.kLcrYstart;
        let kTransmembraneYstart = this.kTransmembraneYstart;
        let kDomainYstart = this.kDomainYstart;
        let kDomainYend = this.kDomainYend;
        let kMiddleY = this.kMiddleY;
        

        let d3ParentElement = d3.select(this.parentNativeElement);
        this.d3Element = d3ParentElement.select<HTMLBaseElement>(htmlElement);
        
        let featureScale = this.d3.scaleLinear()
        .domain([0, data[0].length])
        .range([0, kSvgWidth]);

        let container = this.d3Element
            .selectAll()
            .data(data)
            .enter()
            .append('svg')
            .attr("class", "protein-feature")
            .attr("height", kSvgHeight)
            .attr("width", function(d) { return d.length ? featureScale(d.length) : 0 + 1 })
            .append('g');
        
        // Draw backbone
        container.append('g')
            .filter(function(d){ return d.length && d.length > 0 })
            .append('rect')
            .attr("x", 1)
            .attr("y", kBackboneYstart)
            .attr("width", function(d) { return featureScale(d.length)})
            .attr("height", DrawProteinFeature.kBackboneHeight)
            .attr("fill", "gray");
        
        let drawCoiledCoils = this.drawCoiledCoils;
        let drawLowComplexityRegion = this.drawLowComplexityRegion;
        let drawTransmembraneRegin = this.drawTransmembraneRegin;
        let drawDomain = this.drawDomain;
        let drawDomainBorders = this.drawDomainBorders;
        let nameDomain = this.nameDomain;
        let domainBorder = this.domainBorder;
        
        container.each(function(d, i) {
            let selectedElement = d3.select(this);
            d.coils ? drawCoiledCoils(selectedElement, d, kCoilsYstart, featureScale) : null;                
            d.segs ? drawLowComplexityRegion(selectedElement, d, kLcrYstart, featureScale) : null;
            d.tmhmm ? drawTransmembraneRegin(selectedElement, d, kTransmembraneYstart, featureScale) : null;
            d.pfam30 ? drawDomain(selectedElement, d, drawDomainBorders, nameDomain, 
                domainBorder, kDomainYstart, kDomainYend, kMiddleY, featureScale) : null;
        })
    }

    private drawCoiledCoils(selectedElement: any, data: any, kCoilsYstart, featureScale) {
        selectedElement.selectAll('svg')
            .data(data.coils ? data.coils : [])
            .enter()
            .append('g')
            .filter(function(d){ return d.end - d.start > 0 })                
            .append('rect')
            .attr("x", function(d) { return featureScale(d.start) })
            .attr("y", kCoilsYstart)
            .attr("width", function(d) { 
                return featureScale(d.end-d.start)
            })
            .attr("height", DrawProteinFeature.kCoilsHeight)
            .attr("fill", DrawProteinFeature.domainColors.coils);
    }

    private drawLowComplexityRegion(selectedElement: any, data: any, kLcrYstart, featureScale) {
        selectedElement.selectAll('svg')
            .data(data.segs ? data.segs : [])
            .enter()
            .append('g')
            .filter(function(d){ return d[1] - d[0] > 0 })
            .append('rect')
            .attr("x", function(d) { return featureScale(d[0]) })
            .attr("y", kLcrYstart)
            .attr("width", function(d) { 
                return featureScale(d[1] - d[0])
            })
            .attr("height", DrawProteinFeature.kLcrHeight)
            .attr("fill", DrawProteinFeature.domainColors.lcr);
    }

    private drawTransmembraneRegin(selectedElement: any, data: any, kTransmembraneYstart, featureScale) {
        selectedElement.selectAll('svg')
            .data(data.tmhmm ? data.tmhmm: [])
            .enter()
            .append('g')
            .append('rect')
            .filter(function(d){ return d.end - d.start > 0 })
            .attr("x", function(d) { return featureScale(d.start) })
            .attr("y", kTransmembraneYstart)
            .attr("width", function(d) { 
                return featureScale(d.end-d.start)
            })
            .attr("height", DrawProteinFeature.kTransmembraneHeight)
            .attr("fill", DrawProteinFeature.domainColors.tm);
    }

    private drawDomain(selectedElement: any, data: any, drawDomainBorders, nameDomain, domainBorder, 
        kDomainYstart, kDomainYend, kMiddleY, featureScale) {
        let domain = selectedElement.selectAll('svg')
            .data(data.pfam30 ? data.pfam30 : [])
            .enter()
            .append('g');

        domain.append('rect')
            .filter(function(d){ return d.ali_to - d.ali_from > 0 })
            .attr("x", function(d) { return featureScale(d.ali_from) })
            .attr("y", kDomainYstart)
            .attr("width", function(d) { 
                return featureScale(d.ali_to-d.ali_from);
            })
            .attr("height", DrawProteinFeature.kDomainHeight)
            .attr("fill", DrawProteinFeature.domainColors.domain)
            .attr("stroke", DrawProteinFeature.domainColors.domainStroke)
            .attr("stroke-width", 0);

        drawDomainBorders(domain, domainBorder, kDomainYstart, kDomainYend, featureScale);
        nameDomain(domain, kMiddleY, featureScale);
    }

    private drawDomainBorders(domain: any, domainBorder, kDomainYstart, kDomainYend, featureScale) {
        domain.append('path')
            .filter(function(d){ return d.ali_to - d.ali_from > 0 })
            .attr("d", function(d) { return domainBorder(d, d.ali_cov ? d.ali_cov : '[]', kDomainYstart, kDomainYend, featureScale) })
            .attr("stroke", DrawProteinFeature.domainColors.domainStroke)
            .attr("stroke-width", DrawProteinFeature.kDomainStrokeWidth)
            .attr("fill", "none")
            .attr("stroke-linecap", "round");
    }

    private nameDomain(domain: any, kMiddleY, featureScale) {
        domain.append('text')
            .filter(function(d){ return d.ali_to - d.ali_from > 0 })
            .attr("x", function(d) {return featureScale((d.ali_from+d.ali_to)/2) })
            .attr("y", kMiddleY)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr("textLength", function(d) { 
                return Math.min(d.name.length*DrawProteinFeature.kNameLengthToPixelFactor, 
                d.ali_to-d.ali_from-(DrawProteinFeature.kDomainTextMargin*2)) })
            .attr("font-family", DrawProteinFeature.kFontFamily)
            .attr("font-size", DrawProteinFeature.kFontSize)
            .attr("lengthAdjust", "spacingAndGlyphs")
            .text(function(d) { return d.name});
    }

    private domainBorder(d: pfamInterface, coverage = '[]', kDomainYstart, kDomainYend, featureScale) {
        let partialPixelLeft = coverage[0] === '[' ? 0 : featureScale(DrawProteinFeature.kPartialPixel);
        let partialPixelRight = coverage[1] === ']' ? 0 : featureScale(DrawProteinFeature.kPartialPixel);
        let kQuarterDomainHeight = DrawProteinFeature.kDomainHeight/4;
        let ali_from = featureScale(d.ali_from);
        let ali_to = featureScale(d.ali_to);

        let pathList = [ 
            { "x": ali_from, "y": kDomainYstart},
            { "x": ali_to, "y": kDomainYstart},
            { "x": ali_to - partialPixelRight, "y": kDomainYstart + kQuarterDomainHeight},
            { "x": ali_to, "y": kDomainYstart + kQuarterDomainHeight*2},
            { "x": ali_to - partialPixelRight, "y": kDomainYstart + kQuarterDomainHeight*3},
            { "x": ali_to, "y": kDomainYstart + DrawProteinFeature.kDomainHeight},
            { "x": ali_from, "y": kDomainYend},
            { "x": ali_from + partialPixelLeft, "y": kDomainYend - kQuarterDomainHeight},
            { "x": ali_from, "y": kDomainYend - kQuarterDomainHeight*2},
            { "x": ali_from + partialPixelLeft, "y": kDomainYend - kQuarterDomainHeight*3},
            { "x": ali_from, "y": kDomainYend - DrawProteinFeature.kDomainHeight}
        ]
        let path =  ' M ' + pathList[0].x + ' ' + pathList[0].y + 
                    ' L ' + pathList[1].x + ' ' + pathList[1].y +
                    ' L ' + pathList[2].x + ' ' + pathList[2].y +
                    ' L ' + pathList[3].x + ' ' + pathList[3].y +
                    ' L ' + pathList[4].x + ' ' + pathList[4].y + 
                    ' L ' + pathList[5].x + ' ' + pathList[5].y + 
                    ' L ' + pathList[6].x + ' ' + pathList[6].y + 
                    ' L ' + pathList[7].x + ' ' + pathList[7].y + 
                    ' L ' + pathList[8].x + ' ' + pathList[8].y + 
                    ' L ' + pathList[9].x + ' ' + pathList[9].y + 
                    ' L ' + pathList[10].x + ' ' + pathList[10].y +
                    ' Z'
        return path
    }

}