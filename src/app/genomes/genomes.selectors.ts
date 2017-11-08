import { createSelector } from '@ngrx/store';
import { State } from '../app.reducers';
import { State as GenomesState } from './genomes.reducers';

export const selectGenomes = (state: State) =>
  state.genomes;

export const search = createSelector(
  selectGenomes,
  (state) => state.search,
);

export const pageUrl = (pageType: 'first' | 'last' | 'prev' | 'next') => {
  return createSelector(
    search,
    (searchState) => searchState.links[pageType],
  );
};
