import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as queryString from 'query-string';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MistApi } from '../services/mist-api.service';
import { Navigation }  from './navigation';

import * as MistAction from './mist-actions';
import { Entities } from './entities';

@Injectable()
export class MistEffects {
  static DEBOUNCE_TIME_MS = 300;

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType<MistAction.Search>(
      MistAction.SEARCH_GENOMES, 
      MistAction.SEARCH_GENES,
      MistAction.SEARCH_SCOPE
    ).debounceTime(MistEffects.DEBOUNCE_TIME_MS)
    .map((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      const url = this.mistApi.searchWithPaginationUrl(action.payload, entity);
      return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH), new Navigation(url, action.payload.scope, action.payload.filter));
    });

  @Effect()
  getByIdList$: Observable<Action> = this.actions$
    .ofType<MistAction.GetByIdList>(
      MistAction.GETBY_ID_LIST_GENOMES_SHOPCART, 
      MistAction.GETBY_ID_LIST_GENES_SHOPCART
    ).map((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      const url = this.mistApi.getByIdList(action.payload, entity);
      return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH),  new Navigation(url, null, action.payload.filter, true));
    });

  @Effect()
  fetch$: Observable<Action> = this.actions$.ofType<MistAction.Fetch>(
    MistAction.FETCH_GENOMES, 
    MistAction.FETCH_GENES,
    MistAction.FETCH_GENOMES_SHOPCART, 
    MistAction.FETCH_GENES_SHOPCART,
    MistAction.FETCH_SCOPE
    ).switchMap((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      const nextFetch$ = this.actions$.ofType<MistAction.Fetch>(
        MistAction.FETCH_GENOMES, 
        MistAction.FETCH_GENES,
        MistAction.FETCH_GENOMES_SHOPCART, 
        MistAction.FETCH_GENES_SHOPCART,
        MistAction.FETCH_SCOPE
      ).skip(1);
      return this.http.get(action.payload.url)
        .takeUntil(nextFetch$)
        .map((response) => {
          const matches = response.json();
          const count = parseInt(response.headers.get('x-total-count'), 10);
          const parsed = queryString.parse(queryString.extract(action.payload.url));
          
          const totalPages = Math.ceil(count / parsed.per_page);
          const currentPage = +parsed.page;
          let next, prev, first, last;
          if (action.payload.isGetIdList) {
            next = this.mistApi.getByIdList({search: parsed["where.id"], perPage: parsed.per_page, pageIndex: currentPage + 1, filter: action.payload.filter}, entity);
            prev = this.mistApi.getByIdList({search: parsed["where.id"], perPage: parsed.per_page, pageIndex: currentPage - 1, filter: action.payload.filter}, entity);
            first = this.mistApi.getByIdList({search: parsed["where.id"], perPage: parsed.per_page, pageIndex: 1, filter: action.payload.filter}, entity);
            last = this.mistApi.getByIdList({search: parsed["where.id"], perPage: parsed.per_page, pageIndex: totalPages, filter: action.payload.filter}, entity);
          } else {
              next = this.mistApi.searchWithPaginationUrl({search: parsed.search, scope: action.payload.scope, perPage: parsed.per_page, pageIndex: currentPage + 1, filter: action.payload.filter}, entity);
              prev = this.mistApi.searchWithPaginationUrl({search: parsed.search, scope: action.payload.scope, perPage: parsed.per_page, pageIndex: currentPage - 1, filter: action.payload.filter}, entity);
              first = this.mistApi.searchWithPaginationUrl({search: parsed.search, scope: action.payload.scope, perPage: parsed.per_page, pageIndex: 1, filter: action.payload.filter}, entity);
              last = this.mistApi.searchWithPaginationUrl({search: parsed.search, scope: action.payload.scope, perPage: parsed.per_page, pageIndex: totalPages, filter: action.payload.filter}, entity);
          }
          const links = {first: first, last: last, next: next, prev: prev};
          return new MistAction.FetchDone(MistAction.entityToActionType.get(entity).get(MistAction.FETCH_DONE), {
            perPage: +parsed.per_page,
            count,
            currentPage,
            totalPages,
            links,
            matches,
          });
        })
        .catch((error) => of(new MistAction.FetchError(MistAction.entityToActionType.get(entity).get(MistAction.FETCH_ERROR), error.message)));
    });

  @Effect()
  firstPage$: Observable<Action> = this.actions$.ofType<MistAction.FirstPage>(
    MistAction.FIRST_PAGE_GENOMES, 
    MistAction.FIRST_PAGE_GENES,
    MistAction.FIRST_PAGE_GENOMES_SHOPCART, 
    MistAction.FIRST_PAGE_GENES_SHOPCART,
    MistAction.FIRST_PAGE_SCOPE
    ).map((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH), action.payload); 
    });

  @Effect()
  lastPage$: Observable<Action> = this.actions$.ofType<MistAction.LastPage>(
    MistAction.LAST_PAGE_GENOMES, 
    MistAction.LAST_PAGE_GENES,
    MistAction.LAST_PAGE_GENOMES_SHOPCART, 
    MistAction.LAST_PAGE_GENES_SHOPCART,
    MistAction.LAST_PAGE_SCOPE
    ).map((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH), action.payload); 
    });  

  @Effect()
  prevPage$: Observable<Action> = this.actions$.ofType<MistAction.PrevPage>(
    MistAction.PREV_PAGE_GENOMES, 
    MistAction.PREV_PAGE_GENES,
    MistAction.PREV_PAGE_GENOMES_SHOPCART, 
    MistAction.PREV_PAGE_GENES_SHOPCART,
    MistAction.PREV_PAGE_SCOPE
    ).map((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH), action.payload); 
    });

  @Effect()
  nextPage$: Observable<Action> = this.actions$.ofType<MistAction.NextPage>(
    MistAction.NEXT_PAGE_GENOMES, 
    MistAction.NEXT_PAGE_GENES,
    MistAction.NEXT_PAGE_GENOMES_SHOPCART, 
    MistAction.NEXT_PAGE_GENES_SHOPCART,
    MistAction.NEXT_PAGE_SCOPE
    ).map((action) => {
        const entity = action.type.split("]")[0].replace("[", "");
        return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH), action.payload); 
    });

  constructor(
    private http: Http,
    private actions$: Actions,
    private mistApi: MistApi
  ) {}
  
}
