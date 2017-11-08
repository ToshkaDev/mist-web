import {
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromGenomes from './genomes/genomes.reducers';

export interface State {
  genomes: fromGenomes.State;
}

export const reducers: ActionReducerMap<State> = {
  genomes: fromGenomes.reducer,
};

const isProduction = false;
export const metaReducers: MetaReducer<State>[] = isProduction ? [] : [storeFreeze];
