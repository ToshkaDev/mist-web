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
export const GET_SIGNAL = 'Get Signal Genes';

// Genes actions
export const SEARCH_GENES = `[${Entities.GENES}] Search`;
export const NEXT_PAGE_GENES = `[${Entities.GENES}] Next Page`;
export const PREV_PAGE_GENES = `[${Entities.GENES}] Prev Page`;
export const FIRST_PAGE_GENES = `[${Entities.GENES}] First Page`;
export const LAST_PAGE_GENES = `[${Entities.GENES}] Last Page`;
export const FETCH_GENES = `[${Entities.GENES}] Fetch`;
export const FETCH_DONE_GENES = `[${Entities.GENES}] Fetch Done`;
export const FETCH_ERROR_GENES = `[${Entities.GENES}] Fetch Error`;
export const CLEAR_GENES = `[${Entities.GENES}] Clear`;

// Genomes actions
export const SEARCH_GENOMES = `[${Entities.GENOMES}] Search`;
export const NEXT_PAGE_GENOMES = `[${Entities.GENOMES}] Next Page`;
export const PREV_PAGE_GENOMES = `[${Entities.GENOMES}] Prev Page`;
export const FIRST_PAGE_GENOMES = `[${Entities.GENOMES}] First Page`;
export const LAST_PAGE_GENOMES = `[${Entities.GENOMES}] Last Page`;
export const FETCH_GENOMES = `[${Entities.GENOMES}] Fetch`;
export const FETCH_DONE_GENOMES = `[${Entities.GENOMES}] Fetch Done`;
export const FETCH_ERROR_GENOMES = `[${Entities.GENOMES}] Fetch Error`;
export const CLEAR_GENOMES = `[${Entities.GENOMES}] Clear`;

// Scope actions
export const SEARCH_SCOPE = `[${Entities.SCOPE}] Search`;
export const NEXT_PAGE_SCOPE = `[${Entities.SCOPE}] Next Page`;
export const PREV_PAGE_SCOPE = `[${Entities.SCOPE}] Prev Page`;
export const FIRST_PAGE_SCOPE = `[${Entities.SCOPE}] First Page`;
export const LAST_PAGE_SCOPE = `[${Entities.SCOPE}] Last Page`;
export const FETCH_SCOPE = `[${Entities.SCOPE}] Fetch`;
export const FETCH_DONE_SCOPE = `[${Entities.SCOPE}] Fetch Done`;
export const FETCH_ERROR_SCOPE = `[${Entities.SCOPE}] Fetch Error`;
export const CLEAR_SCOPE = `[${Entities.SCOPE}] Clear`;

// Shop-cart Genes actions
export const NEXT_PAGE_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Next Page`;
export const PREV_PAGE_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Prev Page`;
export const FIRST_PAGE_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart First Page`;
export const LAST_PAGE_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Last Page`;
export const FETCH_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Fetch`;
export const FETCH_DONE_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Fetch Done`;
export const FETCH_ERROR_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Fetch Error`;
export const CLEAR_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Clear`;
export const GETBY_ID_LIST_GENES_SHOPCART = `[${Entities.GENES_SHOPCART}] Shop Cart Get By Id List`;

// Shop-cart  Genomes actions
export const NEXT_PAGE_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Next Page`;
export const PREV_PAGE_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Prev Page`;
export const FIRST_PAGE_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart First Page`;
export const LAST_PAGE_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Last Page`;
export const FETCH_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Fetch`;
export const FETCH_DONE_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Fetch Done`;
export const FETCH_ERROR_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Fetch Error`;
export const CLEAR_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Clear`;
export const GETBY_ID_LIST_GENOMES_SHOPCART = `[${Entities.GENOMES_SHOPCART}] Shop Cart Get By Id List`;

// Signal Genes actions
export const GET_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Get By Genome Version`;
export const NEXT_PAGE_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Next Page`;
export const PREV_PAGE_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Prev Page`;
export const FIRST_PAGE_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes First Page`;
export const LAST_PAGE_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Last Page`;
export const FETCH_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Fetch`;
export const FETCH_DONE_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Fetch Done`;
export const FETCH_ERROR_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Fetch Error`;
export const CLEAR_SIGNAL_GENES = `[${Entities.SIGNAL_GENES}] Signal Genes Clear`;


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

export class GetSignalGenes implements Action {
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
  | GetByIdList
  | GetSignalGenes;

export const entityToActionType: Map<string, Map<string, string>> = new Map([
    [Entities.GENOMES, new Map([
        [SEARCH, SEARCH_GENOMES],
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
        [FETCH, FETCH_GENES],
        [FETCH_DONE, FETCH_DONE_GENES],
        [FETCH_ERROR, FETCH_ERROR_GENES],
        [FIRST_PAGE, FIRST_PAGE_GENES],
        [LAST_PAGE, LAST_PAGE_GENES],
        [NEXT_PAGE, NEXT_PAGE_GENES],
        [PREV_PAGE, PREV_PAGE_GENES],
    ])],
    [Entities.SCOPE, new Map([
        [SEARCH, SEARCH_SCOPE],
        [FETCH, FETCH_SCOPE],
        [FETCH_DONE, FETCH_DONE_SCOPE],
        [FETCH_ERROR, FETCH_ERROR_SCOPE],
        [FIRST_PAGE, FIRST_PAGE_SCOPE],
        [LAST_PAGE, LAST_PAGE_SCOPE],
        [NEXT_PAGE, NEXT_PAGE_SCOPE],
        [PREV_PAGE, PREV_PAGE_SCOPE],
    ])],
    [Entities.GENOMES_SHOPCART, new Map([
        [GETBY_ID_LIST, GETBY_ID_LIST_GENOMES_SHOPCART],
        [FETCH, FETCH_GENOMES_SHOPCART],
        [FETCH_DONE, FETCH_DONE_GENOMES_SHOPCART],
        [FETCH_ERROR, FETCH_ERROR_GENOMES_SHOPCART],
        [FIRST_PAGE, FIRST_PAGE_GENOMES_SHOPCART],
        [LAST_PAGE, LAST_PAGE_GENOMES_SHOPCART],
        [NEXT_PAGE, NEXT_PAGE_GENOMES_SHOPCART],
        [PREV_PAGE, PREV_PAGE_GENOMES_SHOPCART],
    ])],
    [Entities.GENES_SHOPCART, new Map([
        [GETBY_ID_LIST, GETBY_ID_LIST_GENES_SHOPCART],
        [FETCH, FETCH_GENES_SHOPCART],
        [FETCH_DONE, FETCH_DONE_GENES_SHOPCART],
        [FETCH_ERROR, FETCH_ERROR_GENES_SHOPCART],
        [FIRST_PAGE, FIRST_PAGE_GENES_SHOPCART],
        [LAST_PAGE, LAST_PAGE_GENES_SHOPCART],
        [NEXT_PAGE, NEXT_PAGE_GENES_SHOPCART],
        [PREV_PAGE, PREV_PAGE_GENES_SHOPCART],
    ])],
    [Entities.SIGNAL_GENES, new Map([
        [GET_SIGNAL, GET_SIGNAL_GENES],
        [FETCH, FETCH_SIGNAL_GENES],
        [FETCH_DONE, FETCH_DONE_SIGNAL_GENES],
        [FETCH_ERROR, FETCH_ERROR_SIGNAL_GENES],
        [FIRST_PAGE, FIRST_PAGE_SIGNAL_GENES],
        [LAST_PAGE, LAST_PAGE_SIGNAL_GENES],
        [NEXT_PAGE, NEXT_PAGE_SIGNAL_GENES],
        [PREV_PAGE, PREV_PAGE_SIGNAL_GENES],
    ])],
]);