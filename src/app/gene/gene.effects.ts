import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MistApi } from '../core/services/mist-api.service';
import * as gene from './gene.actions';
import { Entities } from  '../core/common/entities';

@Injectable()
export class GeneEffects {

    @Effect()
    fetch$: Observable<Action> = this.actions$.ofType<gene.FetchGene>(gene.FETCH_GENE)
        .map((action) => action.payload)
        .switchMap((query: string) => {
            const url = this.mistApi.getUrl(query, Entities.GENE);
            return this.http.get(url)
            .map((response) => {
                const fetchedGene = response;
                return new gene.FetchGeneDone({
                    fetchedGene
                });
            })
            .catch((error) => of(new gene.FetchGeneError(error.message)));
        });

    @Effect()
    fetchNeighourGenes$: Observable<Action> = this.actions$.ofType<gene.FetchNeighbourGenes>(gene.FETCH_NEIGHBOUR_GENES)
        .map((action) => action.payload)
        .switchMap((query: string) => {
            const url = this.mistApi.getUrl(query, Entities.NEIGHBOUR_GENES);
            return this.http.get(url)
            .map((response) => {
                const neighbourGenes = response;
                return new gene.FetchNeighbourGenesDone({
                    neighbourGenes
                });
            })
            .catch((error) => of(new gene.FetchGeneError(error.message)));
        });

    constructor(
    private http: HttpClient,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
    ) {}
}
