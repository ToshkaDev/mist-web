import { Action } from '@ngrx/store';

export const SEARCH = '[Genomes] Search';
export const NEXT_PAGE = '[Genomes] Next Page';
export const PREV_PAGE = '[Genomes] Prev Page';
export const FIRST_PAGE = '[Genomes] First Page';
export const LAST_PAGE = '[Genomes] Last Page';
export const FETCH = '[Genomes] Fetch';
export const FETCH_DONE = '[Genomes] Fetch Done';
export const FETCH_ERROR = '[Genomes] Fetch Error';

export class Search implements Action {
  readonly type = SEARCH;

  constructor(public payload: any) {}
}

export class FirstPage implements Action {
  readonly type = FIRST_PAGE;

  constructor(public payload: string) {}
}

export class LastPage implements Action {
  readonly type = LAST_PAGE;

  constructor(public payload: string) {}
}

export class NextPage implements Action {
  readonly type = NEXT_PAGE;

  constructor(public payload: string) {}
}

export class PrevPage implements Action {
  readonly type = PREV_PAGE;

  constructor(public payload: string) {}
}

export class Fetch implements Action {
  readonly type = FETCH;

  constructor(public payload: string) {}
}

export class FetchDone implements Action {
  readonly type = FETCH_DONE;

  constructor(public payload: any) {}
}

export class FetchError implements Action {
  readonly type = FETCH_ERROR;

  constructor(public payload: string) {}
}

export type Actions =
  Search
  | FirstPage
  | LastPage
  | NextPage
  | PrevPage
  | Fetch
  | FetchDone
  | FetchError;
