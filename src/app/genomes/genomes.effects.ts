import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as queryString from 'query-string';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
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
  static DEBOUNCE_TIME_MS = 300;


  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType<genomes.Search>(genomes.SEARCH)
    .debounceTime(GenomesEffects.DEBOUNCE_TIME_MS)
    .map((action) => action.payload)
    .map((query: any) => {
      const url = this.mistApi.searchGenomesWithPaginationUrl(query);
      console.log(url);
      return new genomes.Fetch(url);
    });

  @Effect()
  fetch$: Observable<Action> = this.actions$.ofType<genomes.Fetch>(genomes.FETCH)
    .map((action) => action.payload)
    .switchMap((url) => {
      const nextFetch$ = this.actions$.ofType<genomes.Fetch>(genomes.FETCH).skip(1);
      return this.http.get(url)
        .takeUntil(nextFetch$)
        .map((response) => {
          // TODO
          // a) Extract the links, count, currentPage, totalPages
          // c) Abstract into helper functions
          const matches = response.json();
          const count = parseInt(response.headers.get('x-total-count'), 10);
          const parsed = queryString.parse(queryString.extract(url));
          const totalPages = Math.ceil(count / parsed.per_page);
          const currentPage = parseInt(parsed.page, 10);

          console.log("count " + count);
          console.log("parsed.per_page " + parsed.per_page);
          console.log("url " + url);

          const next = this.mistApi.searchGenomesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: currentPage + 1});
          const prev = this.mistApi.searchGenomesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: currentPage - 1});
          const first = this.mistApi.searchGenomesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: 1});
          const last = this.mistApi.searchGenomesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: totalPages});
          const links = {first: first, last: last, next: next, prev: prev};
          
          return new genomes.FetchDone({
            count,
            currentPage,
            totalPages,
            links,
            matches,
          });
        })
        .catch((error) => of(new genomes.FetchError(error.message)));
    });

  @Effect()
  firstPage$: Observable<Action> = this.actions$.ofType<genomes.FirstPage>(genomes.FIRST_PAGE)
    .map((action) => action.payload) 
    .map((url) => new genomes.Fetch(url));

  @Effect()
  lastPage$: Observable<Action> = this.actions$.ofType<genomes.LastPage>(genomes.LAST_PAGE)
    .map((action) => action.payload) 
    .map((url) => new genomes.Fetch(url));

  @Effect()
  prevPage$: Observable<Action> = this.actions$.ofType<genomes.PrevPage>(genomes.PREV_PAGE)
    .map((action) => action.payload) 
    .map((url) => new genomes.Fetch(url));

  @Effect()
  nextPage$: Observable<Action> = this.actions$.ofType<genomes.NextPage>(genomes.NEXT_PAGE)
    .map((action) => action.payload) 
    .map((url) => new genomes.Fetch(url));

  constructor(
    private http: Http,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
  ) {}
}
