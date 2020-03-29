import {  ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { Aseq } from './aseq';
import { pfamInterface } from './aseq';

enum DataType {
    DOMAIN = 'domain',
    TM = 'tm',
    COILED_COILS = 'coiled_coils',
    LOW_COMPLEXITY = 'low_complexity'
}

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
    static readonly kTransmembraneHeight = 60;
    static readonly kCoilsHeight = 45;
    static readonly kLcrHeight = 45;
    static readonly kDomainTextMargin = 5;
    static readonly kNameLengthToPixelFactor = 10;
    static readonly kFontFamily = "Verdana";
    static readonly kFontSize = 18;
    static readonly nonDomainFeaturesSet = new Set([DataType.TM, DataType.COILED_COILS, DataType.LOW_COMPLEXITY]);
    static readonly domainColors = {
        "domain"        : "rgba(255,255,255,0.8)",
        "domainStroke"  : "rgba(0,0,0,0.8)",
        "tm"            : "rgba(0,126,204,0.7)",
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
        this.kSvgHeight = svgHeight != null ? svgHeight : this.kSvgHeight;
    }

    removeElement(htmlElement) {
        let d3ParentElement = this.d3.select(this.parentNativeElement);
        let d3Element = d3ParentElement.select<HTMLBaseElement>(htmlElement);
        d3Element.selectAll("svg.protein-feature").remove();
    }

    drawProteinFeature(htmlElement, data: Aseq[], drawLCR=true, drawCoiled=true, drawDomains=true, drawTM=true) {
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
        let featureScale = d3.scaleLinear()
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
        let drawTransmembraneRegion = this.drawTransmembraneRegion;
        let drawDomain = this.drawDomain;
        let drawDomainBorders = this.drawDomainBorders;
        let nameDomain = this.nameDomain;
        let domainBorder = this.domainBorder;
        let getUniqueFeatureName = this.getUniqueFeatureName;
        let removeOverlapps = this.removeOverlapps;
        let compareEvalues = this.compareEvalues;
        let pfam31NotOverlapped: pfamInterface[];

        container.each(function(d, i) {
            let selectedElement = d3.select(this);
            if (drawCoiled && d.coils && d.coils.length)
                drawCoiledCoils(selectedElement, d, kCoilsYstart, featureScale, getUniqueFeatureName);
            if (drawLCR && d.segs && d.segs.length)
                drawLowComplexityRegion(selectedElement, d, kLcrYstart, featureScale, getUniqueFeatureName);
            if (drawTM && d.tmhmm2 && d.tmhmm2.tms.length)
                drawTransmembraneRegion(selectedElement, d, kTransmembraneYstart, featureScale, getUniqueFeatureName);
            if (drawDomains && d.pfam31 && d.pfam31.length) {
                pfam31NotOverlapped = Array.from(removeOverlapps(d.pfam31, compareEvalues));
                drawDomain(selectedElement, pfam31NotOverlapped, drawDomainBorders, nameDomain,
                domainBorder, kDomainYstart, kDomainYend, kMiddleY, featureScale, getUniqueFeatureName);
            }
        })
    }

    private drawCoiledCoils(selectedElement: any, data: any, kCoilsYstart, featureScale, getUniqueFeatureName) {
        selectedElement.selectAll('svg')
            .data(data.coils ? data.coils : [])
            .enter()
            .append('g')
            .filter(function(d){ return d[1] - d[0] > 0 })
            .append('rect')
            .attr("x", function(d) { return featureScale(d[0]) })
            .attr("y", kCoilsYstart)
            .attr("width", function(d) {
                return featureScale(d[1] - d[0])
            })
            .attr("height", DrawProteinFeature.kCoilsHeight)
            .attr("fill", DrawProteinFeature.domainColors.coils)
            .attr("class", "protein-element")
            .attr("id", function (d){
                return getUniqueFeatureName(d, DataType.COILED_COILS);
            });
    }

    private drawLowComplexityRegion(selectedElement: any, data: any, kLcrYstart, featureScale, getUniqueFeatureName) {
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
            .attr("fill", DrawProteinFeature.domainColors.lcr)
            .attr("class", "protein-element")
            .attr("id", function (d){
                return getUniqueFeatureName(d, DataType.LOW_COMPLEXITY);
            });
    }

    private drawTransmembraneRegion(selectedElement: any, data: any, kTransmembraneYstart, featureScale, getUniqueFeatureName) {
        selectedElement.selectAll('svg')
            .data(data.tmhmm2.tms)
            .enter()
            .append('g')
            .append('rect')
            .filter(function(d){ return d[1] - d[0] > 0 })
            .attr("x", function(d) { return featureScale(d[0]) })
            .attr("y", kTransmembraneYstart)
            .attr("width", function(d) {
                return featureScale(d[1]-d[0])
            })
            .attr("height", DrawProteinFeature.kTransmembraneHeight)
            .attr("fill", DrawProteinFeature.domainColors.tm)
            .attr("class", "protein-element")
            .attr("id", function (d){
                return getUniqueFeatureName(d, DataType.TM);
            });
    }

    private drawDomain(selectedElement: any, pfam31: pfamInterface[], drawDomainBorders, nameDomain, domainBorder,
        kDomainYstart, kDomainYend, kMiddleY, featureScale, getUniqueFeatureName) {
        let domain = selectedElement.selectAll('svg')
            .data(pfam31 && pfam31.length > 0 ? pfam31 : [])
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
            .attr("stroke-width", 0)
            .attr("class", "protein-element")
            .attr("id", function (d){
                return getUniqueFeatureName(d, DataType.DOMAIN);
            });

        let leftAndRightPartialPixels = drawDomainBorders(domain, domainBorder, kDomainYstart, kDomainYend, featureScale, getUniqueFeatureName);
        nameDomain(domain, kMiddleY, featureScale, getUniqueFeatureName, leftAndRightPartialPixels);
    }

    private removeOverlapps(pfam31: pfamInterface[], compareEvalues) {
        let pfam31Sorted: pfamInterface[] = Array.from(pfam31).sort((pfam1,pfam2) => pfam1.ali_from - pfam2.ali_from);
        // overlap threshold is 10 aa
        let tolerance = 10;
        let pfam31Final: Set<pfamInterface> = new Set();
        let pfam1 = pfam31Sorted[0];
        let significantPfam = pfam1;
        let overlapLength;
        let lastAdded = pfam1;
        pfam31Final.add(pfam1);

        pfam31Sorted.slice(1).forEach(pfam2 => {
            if (pfam1.ali_to > pfam2.ali_from) {
                overlapLength = pfam1.ali_to - pfam2.ali_from;
                if (overlapLength > tolerance) {
                    significantPfam = compareEvalues(pfam1, pfam2);
                    // if the previously added is pfam1 and it's less significant than pfam 2
                    // then remove this previously added
                    if (lastAdded === pfam1 && lastAdded !== significantPfam) {
                        pfam31Final.delete(lastAdded);
                    }
                    pfam31Final.add(significantPfam);
                    lastAdded = significantPfam;
                } else {
                    pfam31Final.add(pfam2);
                    lastAdded = pfam2;
                    significantPfam = pfam2;
                }
                pfam1 = significantPfam;
            } else {
                pfam31Final.add(pfam2);
                lastAdded = pfam2;
                significantPfam = pfam2;
                pfam1 = significantPfam;
            }
        })
        return pfam31Final;
    }

    private compareEvalues(pfam1: pfamInterface, pfam2: pfamInterface) {
        let eval1 = pfam1.i_evalue;
        let eval2 = pfam2.i_evalue;
        let significantPfam;
        if (eval1 < eval2)
            significantPfam = pfam1;
        else if (eval1 > eval2)
            significantPfam = pfam2;
        else if (eval1 == eval2) {
            if (pfam1.ali_to - pfam1.ali_from >= pfam2.ali_to - pfam2.ali_from)
                significantPfam = pfam1;
            else
                significantPfam = pfam2;
        }
        return significantPfam;
    }

    private drawDomainBorders(domain: any, domainBorder, kDomainYstart, kDomainYend, featureScale, getUniqueFeatureName) {
        let leftAndRightPartialPixels = [0, 0];
        domain.append('path')
            .filter(function(d){ return d.ali_to - d.ali_from > 0 })
            .attr("d", function(d) {
                let domainBorderResult = domainBorder(d, d.hmm_cov ? d.hmm_cov : '[]', kDomainYstart, kDomainYend, featureScale);
                leftAndRightPartialPixels = domainBorderResult[1];
                return domainBorderResult[0];
            })
            .attr("stroke", DrawProteinFeature.domainColors.domainStroke)
            .attr("stroke-width", DrawProteinFeature.kDomainStrokeWidth)
            .attr("fill", "none")
            .attr("stroke-linecap", "round")
            .attr("class", "protein-element")
            .attr("id", function (d){
                return getUniqueFeatureName(d, DataType.DOMAIN);
            });
        return leftAndRightPartialPixels;
    }

    private nameDomain(domain: any, kMiddleY, featureScale, getUniqueFeatureName, leftAndRightPartialPixels) {
        domain.append('text')
            .filter(function(d){ return d.ali_to - d.ali_from > 0 })
            .attr("x", function(d) {return featureScale((d.ali_from+d.ali_to)/2) })
            .attr("y", kMiddleY)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr("textLength", function(d) {
                let scaledDomainLength = featureScale(d.ali_to)-leftAndRightPartialPixels[0] - featureScale(d.ali_from+13)+leftAndRightPartialPixels[1]
                let nameLength = Math.min(d.name.length*DrawProteinFeature.kNameLengthToPixelFactor,
                    scaledDomainLength)
                return nameLength})
            .attr("font-family", DrawProteinFeature.kFontFamily)
            .attr("font-size", DrawProteinFeature.kFontSize)
            .attr("lengthAdjust", "spacingAndGlyphs")
            .text(function(d) { return d.name})
            .attr("class", "protein-element")
            .attr("id", function (d){
                return getUniqueFeatureName(d, DataType.DOMAIN);
            });
    }

    private getUniqueFeatureName(d, dataType): string {
        let readyName, name = d.name ? d.name : "genericName";
        if (dataType === DataType.DOMAIN)
            readyName = `${name}@${d.ali_from}-${d.ali_to}`;
        else if (DrawProteinFeature.nonDomainFeaturesSet.has(dataType)) 
            readyName = `${name}@${d[0]}-${d[1]}`;
        return readyName;
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
        return [path, [partialPixelRight, partialPixelLeft]]
    }

}
