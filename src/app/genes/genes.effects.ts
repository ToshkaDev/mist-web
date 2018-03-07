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
import * as genes from './genes.actions';
import { MistApi } from '../core/services/mist-api.service';
import GenesFilter from './genes.filter';
import { Navigation }  from '../core/common/navigation';


@Injectable()
export class GenesEffects {
  static DEBOUNCE_TIME_MS = 300;

  constructor(
    private http: Http,
    private actions$: Actions,
    private mistApi: MistApi,
    private store: Store<any>,
  ) {}

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType<genes.Search>(genes.SEARCH)
    .debounceTime(GenesEffects.DEBOUNCE_TIME_MS)
    .map((action) => action.payload)
    .map((query: any) => {
      const url = this.mistApi.searchGenesWithPaginationUrl(query);
      return new genes.Fetch(new Navigation(url, query.filter));
    });

    @Effect()
  fetch$: Observable<Action> = this.actions$.ofType<genes.Fetch>(genes.FETCH)
    .map((action) => action.payload)
    .switchMap((navigation) => {
      const nextFetch$ = this.actions$.ofType<genes.Fetch>(genes.FETCH).skip(1);
      return this.http.get(navigation.url)
        .takeUntil(nextFetch$)
        .map((response) => {
          const matches = response.json();
          const count = parseInt(response.headers.get('x-total-count'), 10);
          const parsed = queryString.parse(queryString.extract(navigation.url));
          const totalPages = Math.ceil(count / parsed.per_page);
          const currentPage = +parsed.page;

          const next = this.mistApi.searchGenesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: currentPage + 1, filter: navigation.filter});
          const prev = this.mistApi.searchGenesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: currentPage - 1, filter: navigation.filter});
          const first = this.mistApi.searchGenesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: 1, filter: navigation.filter});
          const last = this.mistApi.searchGenesWithPaginationUrl({search: parsed.search, perPage: parsed.per_page, pageIndex: totalPages, filter: navigation.filter});
          const links = {first: first, last: last, next: next, prev: prev};
          
          return new genes.FetchDone({
            perPage: +parsed.per_page,
            count,
            currentPage,
            totalPages,
            links,
            matches,
          });
        })
        .catch((error) => of(new genes.FetchError(error.message)));
    });

    @Effect()
    firstPage$: Observable<Action> = this.actions$.ofType<genes.FirstPage>(genes.FIRST_PAGE)
      .map((action) => new genes.Fetch(action.payload));
  
    @Effect()
    lastPage$: Observable<Action> = this.actions$.ofType<genes.LastPage>(genes.LAST_PAGE)
      .map((action) => new genes.Fetch(action.payload)); 
  
    @Effect()
    prevPage$: Observable<Action> = this.actions$.ofType<genes.PrevPage>(genes.PREV_PAGE)
      .map((action) => new genes.Fetch(action.payload)); 
  
    @Effect()
    nextPage$: Observable<Action> = this.actions$.ofType<genes.NextPage>(genes.NEXT_PAGE)
      .map((action) => new genes.Fetch(action.payload));
}