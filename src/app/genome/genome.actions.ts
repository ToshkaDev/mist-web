import { Action } from '@ngrx/store';
export const FETCH_GENOME = '[Genome] Fetch';
export const FETCH_GENOME_DONE = '[Genome] Fetch Done';
export const FETCH_GENOME_ERROR = '[Genome] Fetch Error';


export class FetchGenome implements Action {
    readonly type = FETCH_GENOME;
  
    constructor(public payload: string) {}
}

export class FetchGenomeDone implements Action {
readonly type = FETCH_GENOME_DONE;

constructor(public payload: any) {}
}

export class FetchGenomeError implements Action {
readonly type = FETCH_GENOME_ERROR;

constructor(public payload: string) {}
}

export type Actions =
FetchGenome
| FetchGenomeDone
| FetchGenomeError;