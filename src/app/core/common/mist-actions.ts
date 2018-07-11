import { Action } from '@ngrx/store';

import { Entities } from './entities';

// Generic
export const SEARCH = 'Search';
export const NEXT_PAGE = 'Next Page';
export const PREV_PAGE = 'Prev Page';
export const FIRST_PAGE = 'First Page';
export const LAST_PAGE = 'Last Page';
export const FETCH = 'Fetch';
export const FETCH_DONE = 'Fetch Done';
export const FETCH_ERROR = 'Fetch Error';
export const CLEAR = 'Clear';
export const GETBY_ID_LIST = 'Get By Id List';

// Genes actions
export const SEARCH_GENES = '[genes] Search';
export const NEXT_PAGE_GENES = '[genes] Next Page';
export const PREV_PAGE_GENES = '[genes] Prev Page';
export const FIRST_PAGE_GENES = '[genes] First Page';
export const LAST_PAGE_GENES = '[genes] Last Page';
export const FETCH_GENES = '[genes] Fetch';
export const FETCH_DONE_GENES = '[genes] Fetch Done';
export const FETCH_ERROR_GENES = '[genes] Fetch Error';
export const CLEAR_GENES = '[genes] Clear';
export const GETBY_ID_LIST_GENES = '[genes] Get By Id List';

// Genomes actions
export const SEARCH_GENOMES = '[genomes] Search';
export const NEXT_PAGE_GENOMES = '[genomes] Next Page';
export const PREV_PAGE_GENOMES = '[genomes] Prev Page';
export const FIRST_PAGE_GENOMES = '[genomes] First Page';
export const LAST_PAGE_GENOMES = '[genomes] Last Page';
export const FETCH_GENOMES = '[genomes] Fetch';
export const FETCH_DONE_GENOMES = '[genomes] Fetch Done';
export const FETCH_ERROR_GENOMES = '[genomes] Fetch Error';
export const CLEAR_GENOMES = '[genomes] Clear';
export const GETBY_ID_LIST_GENOMES = '[genomes] Get By Id List';


export class Search implements Action {
    constructor(public type: string, public payload: any) {}
}

export class FirstPage implements Action {
    constructor(public type: string, public payload: any) {}
}

export class LastPage implements Action {
    constructor(public type: string, public payload: any) {}
}

export class NextPage implements Action {
    constructor(public type: string, public payload: any) {}
}

export class PrevPage implements Action {
    constructor(public type: string, public payload: any) {}
}

export class Fetch implements Action {
    constructor(public type: string, public payload: any) {}
}

export class FetchDone implements Action {
    constructor(public type: string, public payload: any) {}
}

export class FetchError implements Action {
    constructor(public type: string, public payload: any) {}
}

export class Clear implements Action {
    constructor(public type: string, public payload: any) {}
}

export class GetByIdList implements Action {
    constructor(public type: string, public payload: any) {}
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

export const entityToActionType: Map<string, Map<string, string>> = new Map([
    [Entities.GENOMES, new Map([
        [SEARCH, SEARCH_GENOMES],
        [GETBY_ID_LIST, GETBY_ID_LIST_GENOMES],
        [FETCH, FETCH_GENOMES],
        [FETCH_DONE, FETCH_DONE_GENOMES],
        [FETCH_ERROR, FETCH_ERROR_GENOMES],
        [FIRST_PAGE, FIRST_PAGE_GENOMES],
        [LAST_PAGE, LAST_PAGE_GENOMES],
        [NEXT_PAGE, NEXT_PAGE_GENOMES],
        [PREV_PAGE, PREV_PAGE_GENOMES],
    ])],
    [Entities.GENES, new Map([
        [SEARCH, SEARCH_GENES],
        [GETBY_ID_LIST, GETBY_ID_LIST_GENES],
        [FETCH, FETCH_GENES],
        [FETCH_DONE, FETCH_DONE_GENES],
        [FETCH_ERROR, FETCH_ERROR_GENES],
        [FIRST_PAGE, FIRST_PAGE_GENES],
        [LAST_PAGE, LAST_PAGE_GENES],
        [NEXT_PAGE, NEXT_PAGE_GENES],
        [PREV_PAGE, PREV_PAGE_GENES],
    ])],
]);