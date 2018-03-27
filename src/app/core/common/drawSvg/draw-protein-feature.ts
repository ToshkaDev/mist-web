import {  ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { Aseq } from './aseq';
import { pfam30Interface } from './aseq';

export default class DrawProteinFeature {
    private d3: D3;
    private parentNativeElement: any;
    private d3Element: Selection<HTMLBaseElement, any, null, undefined>;
    

    // Constants
    static readonly kSvgWidth = 1500;
    static readonly kSvgHeight = 100
    static readonly kBackboneHeight = 10
    static readonly kDomainHeight = 40
    static readonly kDomainStrokeWidth = 3
    static readonly kPartialPixel = 3
    static readonly kTransmembraneHeight = 50
    static readonly kCoilsHeight = 45
    static readonly kLcrHeight = 45
    static readonly kDomainTextMargin = 5
    static readonly kNameLengthToPixelFactor = 10
    static readonly kFontFamily = "Verdana"
    static readonly kFontSize = 18
    static readonly domainColors = {
        "domain"        : "rgba(255,255,255,0.8)",
        "domainStroke"  : "rgba(0,0,0,0.8)",
        "tm"            : "rgba(100,100,100,0.7)",
        "coils"         : "rgba(46,139,87,0.7)",
        "lcr"           : "rgba(199,21,133,0.7)"
    }

    // Computed constants
    static readonly kMiddleY = DrawProteinFeature.kSvgHeight / 2
    static readonly kBackboneYstart = DrawProteinFeature.kMiddleY - (DrawProteinFeature.kBackboneHeight/2)
    static readonly kDomainYstart = DrawProteinFeature.kMiddleY - (DrawProteinFeature.kDomainHeight/2)
    static readonly kDomainYend = DrawProteinFeature.kMiddleY + (DrawProteinFeature.kDomainHeight/2)
    static readonly kTransmembraneYstart = DrawProteinFeature.kMiddleY - (DrawProteinFeature.kTransmembraneHeight/2)
    static readonly kCoilsYstart = DrawProteinFeature.kMiddleY - (DrawProteinFeature.kCoilsHeight/2)
    static readonly kLcrYstart = DrawProteinFeature.kMiddleY - (DrawProteinFeature.kLcrHeight/2)


    constructor(element: ElementRef, d3Service: D3Service) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    drawProteinFeature(htmlElement, data: Aseq[]) {
        let d3 = this.d3;
        let domainBorder = this.domainBorder;

        let d3ParentElement = d3.select(this.parentNativeElement);
        //htmlElement e.x.: 'div.protein-features'
        this.d3Element = d3ParentElement.select<HTMLBaseElement>(htmlElement);
        
        // Create a table
        let row = this.d3Element
        .selectAll()
        .data(data)
        .enter()
        .append('div');

        // Second column for the main architecture SVG
        let architecture = row.append('svg')
        .attr("height", DrawProteinFeature.kSvgHeight)
        .attr("width", function(d) {return d.length ? d.length : 0 + 1})
        .append('g');

        // Draw backbone
        architecture.append('g')
        .filter(function(d){ return d.length && d.length>0 })
        .append('rect')
        .attr("x", 1)
        .attr("y", DrawProteinFeature.kBackboneYstart)
        .attr("width", function(d) { return d.length})
        .attr("height", DrawProteinFeature.kBackboneHeight)
        .attr("fill", "gray");

        architecture.each(function(d, i) {
            // Draw coiled coils
            let coils = d3.select(this).selectAll('svg')
                .data(d.coils ? d.coils : [])
                .enter()
                .append('g')
                .filter(function(d){ return d.end - d.start > 0 })                
                .append('rect')
                .attr("x", function(d) { return d.start })
                .attr("y", DrawProteinFeature.kCoilsYstart)
                .attr("width", function(d) { 
                    return d.end-d.start
                })
                .attr("height", DrawProteinFeature.kCoilsHeight)
                .attr("fill", DrawProteinFeature.domainColors.coils);

            // Draw coiled low-complexity regions
            let lcr = d3.select(this).selectAll('svg')
                .data(d.segs ? d.segs : [])
                .enter()
                .append('g')
                .filter(function(d){ return d.end - d.start > 0 })
                .append('rect')
                .attr("x", function(d) { return d.start })
                .attr("y", DrawProteinFeature.kLcrYstart)
                .attr("width", function(d) { 
                    return d.end-d.start
                })
                .attr("height", DrawProteinFeature.kLcrHeight)
                .attr("fill", DrawProteinFeature.domainColors.lcr);

            // Draw transmembrane regions
            let tm = d3.select(this).selectAll('svg')
                .data(d.tmhmm ? d.tmhmm:[])
                .enter()
                .append('g')
                .append('rect')
                .filter(function(d){ return d.end - d.start > 0 })
                .attr("x", function(d) { return d.start })
                .attr("y", DrawProteinFeature.kTransmembraneYstart)
                .attr("width", function(d) { 
                    return d.end-d.start
                })
                .attr("height", DrawProteinFeature.kTransmembraneHeight)
                .attr("fill", DrawProteinFeature.domainColors.tm);


            // Draw protein domains
            let domain = d3.select(this).selectAll('svg')
                .data(d.pfam30 ? d.pfam30 : [])
                .enter()
                .append('g');

            domain.append('rect')
                .filter(function(d){ return d.ali_to - d.ali_from > 0 })
                .attr("x", function(d) { return d.ali_from })
                .attr("y", DrawProteinFeature.kDomainYstart)
                .attr("width", function(d) { 
                    return d.ali_to-d.ali_from
                })
                .attr("height", DrawProteinFeature.kDomainHeight)
                .attr("fill", DrawProteinFeature.domainColors.domain)
                .attr("stroke", DrawProteinFeature.domainColors.domainStroke)
                .attr("stroke-width", 0);
            
            // Draw domain borders
            domain.append('path')
                .filter(function(d){ return d.ali_to - d.ali_from > 0 })
                .attr("d", function(d) { return domainBorder(d, d.ali_cov ? d.ali_cov : '[]') })
                .attr("stroke", DrawProteinFeature.domainColors.domainStroke)
                .attr("stroke-width", DrawProteinFeature.kDomainStrokeWidth)
                .attr("fill", "none")
                .attr("stroke-linecap", "round");

            // Name the domain
            domain.append('text')
                .filter(function(d){ return d.ali_to - d.ali_from > 0 })
                .attr("x", function(d) {return (d.ali_from+d.ali_to)/2 })
                .attr("y", DrawProteinFeature.kMiddleY)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("textLength", function(d) { return Math.min(d.name.length*DrawProteinFeature.kNameLengthToPixelFactor, d.ali_to-d.ali_from-(DrawProteinFeature.kDomainTextMargin*2)) })
                .attr("font-family", DrawProteinFeature.kFontFamily)
                .attr("font-size", DrawProteinFeature.kFontSize)
                .attr("lengthAdjust", "spacingAndGlyphs")
                .text(function(d) { return d.name});
        })

    }
    
    private domainBorder(d: pfam30Interface, coverage = '[]') {
        let partialPixelLeft = coverage[0] === '[' ? 0 : DrawProteinFeature.kPartialPixel
        let partialPixelRight = coverage[1] === ']' ? 0 : DrawProteinFeature.kPartialPixel
        let kQuarterDomainHeight = DrawProteinFeature.kDomainHeight/4

        let pathList = [ 
            { "x": d.ali_from, "y": DrawProteinFeature.kDomainYstart},
            { "x": d.ali_to, "y": DrawProteinFeature.kDomainYstart},
            { "x": d.ali_to - partialPixelRight, "y": DrawProteinFeature.kDomainYstart + kQuarterDomainHeight},
            { "x": d.ali_to, "y": DrawProteinFeature.kDomainYstart + kQuarterDomainHeight*2},
            { "x": d.ali_to - partialPixelRight, "y": DrawProteinFeature.kDomainYstart + kQuarterDomainHeight*3},
            { "x": d.ali_to, "y": DrawProteinFeature.kDomainYstart + DrawProteinFeature.kDomainHeight},
            { "x": d.ali_from, "y": DrawProteinFeature.kDomainYend},
            { "x": d.ali_from + partialPixelLeft, "y": DrawProteinFeature.kDomainYend - kQuarterDomainHeight},
            { "x": d.ali_from, "y": DrawProteinFeature.kDomainYend - kQuarterDomainHeight*2},
            { "x": d.ali_from + partialPixelLeft, "y": DrawProteinFeature.kDomainYend - kQuarterDomainHeight*3},
            { "x": d.ali_from, "y": DrawProteinFeature.kDomainYend - DrawProteinFeature.kDomainHeight}
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