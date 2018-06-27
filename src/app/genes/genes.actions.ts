import { Action } from '@ngrx/store';

export const SEARCH = '[Genes] Search';
export const NEXT_PAGE = '[Genes] Next Page';
export const PREV_PAGE = '[Genes] Prev Page';
export const FIRST_PAGE = '[Genes] First Page';
export const LAST_PAGE = '[Genes] Last Page';
export const FETCH = '[Genes] Fetch';
export const FETCH_DONE = '[Genes] Fetch Done';
export const FETCH_ERROR = '[Genes] Fetch Error';
export const CLEAR = '[Genes] Clear';
export const GETBY_ID_LIST = '[Genes] Get By Id List';

export class Search implements Action {
  readonly type = SEARCH;

  constructor(public payload: any) {}
}

export class FirstPage implements Action {
  readonly type = FIRST_PAGE;

  constructor(public payload: any) {}
}

export class LastPage implements Action {
  readonly type = LAST_PAGE;

  constructor(public payload: any) {}
}

export class NextPage implements Action {
  readonly type = NEXT_PAGE;

  constructor(public payload: any) {}
}

export class PrevPage implements Action {
  readonly type = PREV_PAGE;

  constructor(public payload: any) {}
}

export class Fetch implements Action {
  readonly type = FETCH;

  constructor(public payload: any) {}
}

export class FetchDone implements Action {
  readonly type = FETCH_DONE;

  constructor(public payload: any) {}
}

export class FetchError implements Action {
  readonly type = FETCH_ERROR;

  constructor(public payload: string) {}
}

export class Clear implements Action {
  readonly type = CLEAR;
}

export class GetByIdList implements Action {
  readonly type = GETBY_ID_LIST;

  constructor(public payload: any) {}
}

export type Actions =
  Search
  | FirstPage
  | LastPage
  | NextPage
  | PrevPage
  | Fetch
  | FetchDone
  | FetchError
  | Clear
  | GetByIdList;