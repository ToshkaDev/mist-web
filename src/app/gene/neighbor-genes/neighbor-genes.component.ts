import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {FetchNeighbourGenes } from '../gene.actions';
import * as fromGenes from '../gene.selectors';


@Component({
    selector: 'mist-neighbor-genes',
    templateUrl: './neighbor-genes.pug',
  })
export class NeighborGenes implements OnInit {
    @Input() private geneStableId: string;
    @Input() private gene$: Observable<any>;
    private neighbourGenes$: Observable<any[]>;
    private errorMessage$: Observable<string>;
    
    constructor(private store: Store<any>) {
    }

    ngOnInit() {
        this.errorMessage$ = this.store.select(fromGenes.getFetchErrorMessage);
        this.neighbourGenes$ = this.store.select(fromGenes.getNeighbourGenes);
        this.getNeighbourGenes(this.geneStableId);
    }

    getNeighbourGenes(query: string) {
        this.store.dispatch(new FetchNeighbourGenes(query));
    }
}