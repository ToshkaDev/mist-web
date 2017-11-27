import * as Genomes from './genomes.actions';

export interface State {
  search: {
    count: number;
    currentPage: number;
    errorMessage: string;
    isFetching: boolean;
    links: {
      first?: string;
      last?: string;
      next?: string;
      prev?: string;
    },
    matches: any[];
    query: string;
    totalPages: number;
  };
}

const initialState: State = {
  search: {
    count: null,
    currentPage: null,
    errorMessage: null,
    isFetching: false,
    links: {},
    matches: [],
    query: null,
    totalPages: null,
  },
};

export function reducer (state = initialState, action: Genomes.Actions){
  switch (action.type) {
    case Genomes.SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          count: null,
          currentPage: null,
          isFetching: false,
          links: {},
          matches: [],
          query: action.payload,
          totalPages: null,
        },
    };

    case Genomes.FETCH:
      const url = action.payload;
      if (url) {
        return {
          ...state,
          search: {
            ...state.search,
            errorMessage: null,
            isFetching: true,
            matches: [],
          },
        };
      }
      break;

    case Genomes.FETCH_DONE:
      const { payload } = action;
      return {
        ...state,
        search: {
          ...state.search,
          count: payload.count,
          currentPage: payload.currentPage,
          isFetching: false,
          links: payload.links,
          matches: payload.matches,
          totalPages: payload.totalPages,
        },
      };

    case Genomes.FETCH_ERROR:
      return {
        ...state,
        search: {
          ...state.search,
          errorMessage: action.payload,
          isFetching: false,
        },
      };
  }

  return state;
};
