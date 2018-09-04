import { createSelector } from '@ngrx/store';
import { State } from '../app.reducers';

export const selectGene = (state: State) =>
    state.gene;


export const fetch = createSelector(
    selectGene,
    (fetchState) => fetchState.fetch,
);

export const getGene = createSelector(
    fetch,
    (fetchState) => fetchState.gene,
);

export const getNeighbourGenes = createSelector(
    fetch,
    (fetchState) => fetchState.neighbourGenes,
);

export const getFetchErrorMessage = createSelector(
    fetch,
    (fetchState) => fetchState.errorMessage,
);

