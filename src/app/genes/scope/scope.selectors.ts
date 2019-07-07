import { createSelector } from '@ngrx/store';
import { State } from '../../app.reducers';

export const selectScope = (state: State) =>
  state.scope;

export const search = createSelector(
  selectScope,
  (state) => state.search,
);

export const getSearchQuery = createSelector(
  search,
  (searchState) => searchState.query,
);

// We still need this to be able to use the abstract mist-component class
export const getSearchScope = createSelector(
  search,
  (searchState) => searchState.scope,
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

export const getIsSearchPerforemd = createSelector(
  search,
  (searchState) => searchState.searchPerforemd,
);

export const getPageInfo = createSelector(
  search,
  (searchState) => { 
    return {
      count: searchState.count,  
      totalPages: searchState.totalPages, 
      currentPage: searchState.currentPage,
      perPage: searchState.perPage
    }
  }
);

export const getPageLinks = createSelector(
  search,
  (searchState) => searchState.links,
);