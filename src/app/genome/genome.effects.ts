import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MistApi } from '../core/services/mist-api.service';
import * as genome from './genome.actions';
import { Entities } from '../core/common/entities';

@Injectable()
export class GenomeEffects {

    @Effect()
    fetch$: Observable<Action> = this.actions$.ofType<genome.FetchGenome>(genome.FETCH_GENOME)
        .map((action) => action.payload)
        .switchMap((query: string) => {
        const url = this.mistApi.getUrl(query, Entities.GENOME);
        return this.http.get(url)
        .map((response) => {
            const fetchedGenome = response;
            return new genome.FetchGenomeDone({
                fetchedGenome
            });
        })
        .catch((error) => of(new genome.FetchGenomeError(error.message)));
        });

    constructor(
    private http: HttpClient,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
    ) {}
}
