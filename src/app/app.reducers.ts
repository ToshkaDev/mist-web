import {
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromGenomes from './genomes/genomes.reducers';
import * as fromGenome from './genome/genome.reducers';
import * as fromGenes from './genes/genes.reducers';
import * as fromGene from './gene/gene.reducers';

export interface State {
  genomes: fromGenomes.State;
  genome: fromGenome.State;
  genes: fromGenes.State;
  gene: fromGene.State;
}

export const reducers: ActionReducerMap<State> = {
  genomes: fromGenomes.reducer,
  genome: fromGenome.reducer,
  genes: fromGenes.reducer,
  gene: fromGene.reducer
};

const isProduction = false;
export const metaReducers: MetaReducer<State>[] = isProduction ? [] : [storeFreeze];
