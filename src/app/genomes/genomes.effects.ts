import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MistApi } from '../core/services/mist-api.service';
import * as genomes from './genomes.actions';
import { pageUrl, search } from './genomes.selectors';

@Injectable()
export class GenomesEffects {
  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType<genomes.Search>(genomes.SEARCH)
    .map((action) => action.payload)
    .map((query: string) => {
      const url = this.mistApi.searchGenomesUrl(query);
      console.log('Sending out', url);
      return new genomes.Fetch(url);
    });

  @Effect()
  fetch$: Observable<Action> = this.actions$.ofType<genomes.Fetch>(genomes.FETCH)
    .map((action) => action.payload)
    .switchMap((url) => {
      const nextFetch$ = this.actions$.ofType<genomes.Fetch>(genomes.FETCH).skip(1);

      console.log('Fetching url', url);

      return this.http.get(url)
        .takeUntil(nextFetch$)
        .map((response) => {
          // TODO
          // a) Extract the links, count, currentPage, totalPages
          // c) Abstract into helper functions
          const matches = response.json();
          return new genomes.FetchDone({
            count: parseInt(response.headers.get('x-total-count'), 10),
            matches,
          });
        })
        .catch((error) => of(new genomes.FetchError(error.message)));
    });

  @Effect()
  firstPage$: Observable<Action> = this.actions$.ofType<genomes.FirstPage>(genomes.FIRST_PAGE)
    .switchMap(() => this.store.select(pageUrl('first')))
    .map((url) => new genomes.Fetch(url));

  @Effect()
  lastPage$: Observable<Action> = this.actions$.ofType<genomes.LastPage>(genomes.LAST_PAGE)
    .switchMap(() => this.store.select(pageUrl('last')))
    .map((url) => new genomes.Fetch(url));

  @Effect()
  prevPage$: Observable<Action> = this.actions$.ofType<genomes.PrevPage>(genomes.PREV_PAGE)
    .switchMap(() => this.store.select(pageUrl('prev')))
    .map((url) => new genomes.Fetch(url));

  @Effect()
  nextPage$: Observable<Action> = this.actions$.ofType<genomes.NextPage>(genomes.NEXT_PAGE)
    .switchMap(() => this.store.select(pageUrl('next')))
    .map((url) => new genomes.Fetch(url));

  constructor(
    private http: Http,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
  ) {}
}
