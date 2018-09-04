import { createSelector } from '@ngrx/store';
import { State } from '../app.reducers';

export const selectGenome = (state: State) =>
    state.genome;


export const fetch = createSelector(
    selectGenome,
    (fetchState) => fetchState.fetch,
);

export const getFetchResult = createSelector(
    fetch,
    (fetchState) => fetchState.genome,
);

export const getFetchErrorMessage = createSelector(
    fetch,
    (fetchState) => fetchState.errorMessage,
);

