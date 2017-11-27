import {Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    selector: 'mist-genome',
    styleUrls: [],
    templateUrl: './genome.pug',
  })
export class GenomeComponent implements OnInit {
    constructor(private route: ActivatedRoute, private location: Location) {
    }

    ngOnInit() {}

    getGenome() {
        const assemblyVersion = this.route.snapshot.paramMap.get('version');
        
    }

}