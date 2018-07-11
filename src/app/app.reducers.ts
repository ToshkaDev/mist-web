import {
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromGenome from './genome/genome.reducers';
import * as fromGene from './gene/gene.reducers';

import * as mistState from './core/common/mist-state';

export interface State {
  genomes: mistState.State,
  genome: fromGenome.State,
  genes: mistState.State,
  gene: fromGene.State
}

export const reducers: ActionReducerMap<State> = {
  genomes: mistState.genomesReducer,
  genome: fromGenome.reducer,
  genes: mistState.genesReducer,
  gene: fromGene.reducer
};

const isProduction = false;
export const metaReducers: MetaReducer<State>[] = isProduction ? [] : [storeFreeze];
