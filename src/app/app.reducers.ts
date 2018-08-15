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
  genomes_shopcart: mistState.State,
  genome: fromGenome.State,
  genes: mistState.State,
  genes_shopcart: mistState.State,
  gene: fromGene.State,
  scope: mistState.State
}

export const reducers: ActionReducerMap<State> = {
  genomes: mistState.genomesReducer,
  genomes_shopcart: mistState.genomesReducerShopCart,
  genome: fromGenome.reducer,
  genes: mistState.genesReducer,
  genes_shopcart: mistState.genesReducerShopCart,
  gene: fromGene.reducer,
  scope: mistState.scopeReducer
};

const isProduction = false;
export const metaReducers: MetaReducer<State>[] = isProduction ? [] : [storeFreeze];
