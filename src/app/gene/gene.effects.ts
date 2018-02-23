import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MistApi } from '../core/services/mist-api.service';
import * as gene from './gene.actions';

@Injectable()
export class GeneEffects {
    
    @Effect()
    fetch$: Observable<Action> = this.actions$.ofType<gene.FetchGene>(gene.FETCH_GENE)
        .map((action) => action.payload)
        .switchMap((query: string) => {
            const url = this.mistApi.getGeneUrl(query);
            console.log("url " + url)
            return this.http.get(url)
            .map((response) => {
                const fetchedGene = response.json();
                return new gene.FetchGeneDone({
                    fetchedGene
                });
            })
            .catch((error) => of(new gene.FetchGeneError(error.message)));
        });

    constructor(
    private http: Http,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
    ) {}
}