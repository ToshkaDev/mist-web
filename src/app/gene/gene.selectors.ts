import { createSelector } from '@ngrx/store';
import { State } from '../app.reducers';
import { State as GeneState } from './gene.reducers';

export const selectGene = (state: State) =>
    state.gene;


export const fetch = createSelector(
    selectGene,
    (fetchState) => fetchState.fetch,
);

export const getFetchResult = createSelector(
    fetch,
    (fetchState) => fetchState.gene,
);

export const getFetchErrorMessage = createSelector(
    fetch,
    (fetchState) => fetchState.errorMessage,
);

