import {Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { FetchGenome } from './genome.actions';
import * as fromGenomes from './genome.selectors';

@Component({
    selector: 'mist-genome',
    styleUrls: [],
    templateUrl: './genome.component.pug',
  })
export class GenomeComponent implements OnInit {
    errorMessage$: Observable<string>;
    genome$: Observable<string>;
    assemblyVersion: string;

    constructor(private store: Store<any>, private route: ActivatedRoute, private location: Location) {
        console.log("From GenomeComponent");
    }

    ngOnInit() {
        this.errorMessage$ = this.store.select(fromGenomes.getFetchErrorMessage);
        this.genome$ = this.store.select(fromGenomes.getFetchResult);       
        this.assemblyVersion = this.route.snapshot.paramMap.get('version');
        console.log("this.assemblyVersion " + this.assemblyVersion);
        this.getGenome(this.assemblyVersion);
    }
    
    getGenome(query: string) {
        this.store.dispatch(new FetchGenome(query));
    }
}