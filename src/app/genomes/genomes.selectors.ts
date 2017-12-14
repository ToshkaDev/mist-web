import { createSelector } from '@ngrx/store';
import { State } from '../app.reducers';
import { State as GenomesState } from './genomes.reducers';

export const selectGenomes = (state: State) =>
  state.genomes;

export const search = createSelector(
  selectGenomes,
  (state) => state.search,
);

export const getSearchQuery = createSelector(
  search,
  (searchState) => searchState.query,
);

export const getSearchIsFetching = createSelector(
  search,
  (searchState) => searchState.isFetching,
);

export const getSearchErrorMessage = createSelector(
  search,
  (searchState) => searchState.errorMessage,
);

export const getSearchResults = createSelector(
  search,
  (searchState) => searchState.matches,
);

export const getTotalPages = createSelector(
  search,
  (searchState) => searchState.totalPages,
);

export const getPageLinks = createSelector(
  search,
  (searchState) => searchState.links,
);

export const getCurrentPage = createSelector(
  search,
  (searchState) => searchState.currentPage,
);

export const getCount = createSelector(
  search,
  (searchState) => searchState.count,
);


export const pageUrl = (pageType: 'first' | 'last' | 'prev' | 'next') => {
  return createSelector(
    search,
    (searchState) => searchState.links[pageType],
  );
};
