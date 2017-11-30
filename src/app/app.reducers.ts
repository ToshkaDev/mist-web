import {
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromGenomes from './genomes/genomes.reducers';
import * as fromGenome from './genome/genome.reducers';

export interface State {
  genomes: fromGenomes.State;
  genome: fromGenome.State;
}

export const reducers: ActionReducerMap<State> = {
  genomes: fromGenomes.reducer,
  genome: fromGenome.reducer,
};

const isProduction = false;
export const metaReducers: MetaReducer<State>[] = isProduction ? [] : [storeFreeze];
