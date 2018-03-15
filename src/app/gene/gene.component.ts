import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { FetchGene, FetchNeighbourGenes } from './gene.actions';
import * as fromGenes from './gene.selectors';
import GeneView from './gene.view.model';

@Component({
    selector: 'mist-gene',
    templateUrl: './gene.pug',
  })
export class GeneComponent implements OnInit {
    private geneStableId: string;
    private errorMessage$: Observable<string>;
    private gene$: Observable<any>;
    private neighbourGenes$: Observable<any[]>;
    private geneViewModel: GeneView;
    
    constructor(private store: Store<any>, private route: ActivatedRoute, private location: Location) {
    }

    ngOnInit() {
        this.errorMessage$ = this.store.select(fromGenes.getFetchErrorMessage);
        this.gene$ = this.store.select(fromGenes.getGene);
        this.neighbourGenes$ = this.store.select(fromGenes.getNeighbourGenes);
        this.geneStableId = this.route.snapshot.paramMap.get('stable_id');
        this.getGene(this.geneStableId);
        this.gene$.take(2).subscribe(result => result ? this.geneViewModel = new GeneView(result) : this.geneViewModel = null);
    }
    
    getGene(query: string) {
        this.store.dispatch(new FetchGene(query));
        this.getNeighbourGenes(this.geneStableId);
    }

    getNeighbourGenes(query: string) {
        this.store.dispatch(new FetchNeighbourGenes(query));
    }
}