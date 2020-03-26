import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { ActivatedRoute } from '@angular/router';

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
  getSignalGenes$: Observable<Action> = this.actions$
    .ofType<MistAction.GetSignalGenes>(
      MistAction.GET_SIGNAL_GENES
    ).map((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      const url = this.mistApi.getSignalGenes(action.payload, entity);
      return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH),  new Navigation(url, null, action.payload.filter));
    });

  @Effect()
  fetch$: Observable<Action> = this.actions$.ofType<MistAction.Fetch>(
    MistAction.FETCH_GENOMES,
    MistAction.FETCH_GENES,
    MistAction.FETCH_GENOMES_SHOPCART,
    MistAction.FETCH_GENES_SHOPCART,
    MistAction.FETCH_SCOPE,
    MistAction.FETCH_SIGNAL_GENES
    ).switchMap((action) => {
      const entity = action.type.split("]")[0].replace("[", "");
      const nextFetch$ = this.actions$.ofType<MistAction.Fetch>(
        MistAction.FETCH_GENOMES,
        MistAction.FETCH_GENES,
        MistAction.FETCH_GENOMES_SHOPCART,
        MistAction.FETCH_GENES_SHOPCART,
        MistAction.FETCH_SCOPE,
        MistAction.FETCH_SIGNAL_GENES
      ).skip(1);
      const body =  queryString.parse(queryString.extract(action.payload.url));
      const mistUrl = action.payload.url.split("?")[0];
      const options = {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json',
          }),
        observe: 'response' as 'body'};
      return this.http.post(mistUrl, body, options)
        .takeUntil(nextFetch$)
        .map((response: any) => {
          const matches = response.body;
          const count = parseInt(response.headers.get('x-total-count'), 10);
          const totalPages = Math.ceil(count / body.per_page);
          const currentPage = +body.page;
          let next, prev, first, last;
          if (action.payload.isGetIdList) {
            next = this.mistApi.getByIdList({search: body["where.id"], perPage: body.per_page, pageIndex: currentPage + 1, filter: action.payload.filter}, entity);
            prev = this.mistApi.getByIdList({search: body["where.id"], perPage: body.per_page, pageIndex: currentPage - 1, filter: action.payload.filter}, entity);
            first = this.mistApi.getByIdList({search: body["where.id"], perPage: body.per_page, pageIndex: 1, filter: action.payload.filter}, entity);
            last = this.mistApi.getByIdList({search: body["where.id"], perPage: body.per_page, pageIndex: totalPages, filter: action.payload.filter}, entity);
          } else if (entity === Entities.SIGNAL_GENES)  {
            let urlArray = action.payload.url.split("/")
            let genome_version = urlArray[urlArray.length-2];
            next = this.mistApi.getSignalGenes({search: genome_version, perPage: body.per_page, pageIndex: currentPage + 1, filter: action.payload.filter}, entity);
            prev = this.mistApi.getSignalGenes({search: genome_version, perPage: body.per_page, pageIndex: currentPage - 1, filter: action.payload.filter}, entity);
            first = this.mistApi.getSignalGenes({search: genome_version, perPage: body.per_page, pageIndex: 1, filter: action.payload.filter}, entity);
            last = this.mistApi.getSignalGenes({search: genome_version, perPage: body.per_page, pageIndex: totalPages, filter: action.payload.filter}, entity);
          } else {
              next = this.mistApi.searchWithPaginationUrl({search: body.search, scope: action.payload.scope, perPage: body.per_page, pageIndex: currentPage + 1, filter: action.payload.filter}, entity);
              prev = this.mistApi.searchWithPaginationUrl({search: body.search, scope: action.payload.scope, perPage: body.per_page, pageIndex: currentPage - 1, filter: action.payload.filter}, entity);
              first = this.mistApi.searchWithPaginationUrl({search: body.search, scope: action.payload.scope, perPage: body.per_page, pageIndex: 1, filter: action.payload.filter}, entity);
              last = this.mistApi.searchWithPaginationUrl({search: body.search, scope: action.payload.scope, perPage: body.per_page, pageIndex: totalPages, filter: action.payload.filter}, entity);
          }
          const links = {first: first, last: last, next: next, prev: prev};
          return new MistAction.FetchDone(MistAction.entityToActionType.get(entity).get(MistAction.FETCH_DONE), {
            perPage: +body.per_page,
            count,
            currentPage,
            totalPages,
            links,
            matches,
          });
        })
        .catch((error) => of(new MistAction.FetchError(MistAction.entityToActionType.get(entity).get(MistAction.FETCH_ERROR), { errorMessage: "Error happened" })));
    });

  @Effect()
  firstPage$: Observable<Action> = this.actions$.ofType<MistAction.FirstPage>(
    MistAction.FIRST_PAGE_GENOMES,
    MistAction.FIRST_PAGE_GENES,
    MistAction.FIRST_PAGE_GENOMES_SHOPCART,
    MistAction.FIRST_PAGE_GENES_SHOPCART,
    MistAction.FIRST_PAGE_SCOPE,
    MistAction.FIRST_PAGE_SIGNAL_GENES
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
    MistAction.LAST_PAGE_SCOPE,
    MistAction.LAST_PAGE_SIGNAL_GENES
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
    MistAction.PREV_PAGE_SCOPE,
    MistAction.PREV_PAGE_SIGNAL_GENES
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
    MistAction.NEXT_PAGE_SCOPE,
    MistAction.NEXT_PAGE_SIGNAL_GENES
    ).map((action) => {
        const entity = action.type.split("]")[0].replace("[", "");
        return new MistAction.Fetch(MistAction.entityToActionType.get(entity).get(MistAction.FETCH), action.payload);
    });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private actions$: Actions,
    private mistApi: MistApi
  ) {}

}
