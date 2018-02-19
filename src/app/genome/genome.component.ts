import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { FetchGenome } from './genome.actions';
import * as fromGenomes from './genome.selectors';
import GenomeView from './genome.view.model';

@Component({
    selector: 'mist-genome',
    templateUrl: './genome.component.pug',
  })
export class GenomeComponent implements OnInit {
    private assemblyVersion: string;
    private errorMessage$: Observable<string>;
    private genome$: Observable<any>;
    private genomeViewModel: GenomeView;
    
    constructor(private store: Store<any>, private route: ActivatedRoute, private location: Location) {
    }

    ngOnInit() {
        this.errorMessage$ = this.store.select(fromGenomes.getFetchErrorMessage);
        this.genome$ = this.store.select(fromGenomes.getFetchResult);       
        this.assemblyVersion = this.route.snapshot.paramMap.get('version');
        this.getGenome(this.assemblyVersion);
        this.genome$.subscribe(result => 
            result ? this.genomeViewModel = new GenomeView(result) : this.genomeViewModel = null);
    }
    
    getGenome(query: string) {
        this.store.dispatch(new FetchGenome(query));
    }
}