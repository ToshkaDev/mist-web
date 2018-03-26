import { Action } from '@ngrx/store';
export const FETCH_GENE = '[Gene] Fetch';
export const FETCH_NEIGHBOUR_GENES = '[Gene Neighbours] Fetch';
export const FETCH_GENE_DONE = '[Gene] Fetch Done';
export const FETCH_NEIGHBOUR_GENES_DONE = '[Gene Neighbours] Fetch Done';
export const FETCH_GENE_ERROR = '[Gene] Fetch Error';


export class FetchNeighbourGenes implements Action {
    readonly type = FETCH_NEIGHBOUR_GENES;
    constructor(public payload: string) {}
}


export class FetchGene implements Action {
    readonly type = FETCH_GENE;
    constructor(public payload: string) {}
}

export class FetchGeneDone implements Action {
    readonly type = FETCH_GENE_DONE;
    constructor(public payload: any) {}
}

export class FetchNeighbourGenesDone implements Action {
    readonly type = FETCH_NEIGHBOUR_GENES_DONE;
    constructor(public payload: any) {}
}

export class FetchGeneError implements Action {
    readonly type = FETCH_GENE_ERROR;
    constructor(public payload: string) {}
}

export type Actions =
FetchNeighbourGenes
| FetchNeighbourGenesDone
| FetchGene
| FetchGeneDone
| FetchGeneError;