import * as MistAction from './mist-actions';

export interface State {
    search: {
      count: number;
      currentPage: number;
      perPage: number;
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
  
export const initialState: State = {
    search: {
      count: null,
      currentPage: null,
      perPage: null,
      errorMessage: null,
      isFetching: false,
      links: {},
      matches: [],
      query: null,
      totalPages: null,
    },
  };

const genesActionTypes = [
    MistAction.SEARCH_GENES,
    MistAction.GETBY_ID_LIST_GENES,
    MistAction.FETCH_GENES, 
    MistAction.FETCH_DONE_GENES, 
    MistAction.FETCH_ERROR_GENES, 
    MistAction.CLEAR_GENES
];
const genomesActionTypes = [
    MistAction.SEARCH_GENOMES,
    MistAction.GETBY_ID_LIST_GENOMES,
    MistAction.FETCH_GENOMES, 
    MistAction.FETCH_DONE_GENOMES,
    MistAction.FETCH_ERROR_GENOMES, 
    MistAction.CLEAR_GENOMES
];

export function genomesReducer(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, genomesActionTypes);
}

export function genesReducer(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, genesActionTypes);
}

function reducer (state, action: MistAction.Actions,  actions) {
    switch (action.type) {
        case actions[0]:
            return {
                ...state,
                search: {
                    ...state.search,
                    count: null,
                    currentPage: null,
                    isFetching: false,
                    links: {},
                    matches: [],
                    query: action.payload.search,
                    totalPages: null,
                },
            };
        case actions[1]:
            return {
                ...state,
                search: {
                    ...state.search,
                    count: null,
                    currentPage: null,
                    isFetching: false,
                    links: {},
                    matches: [],
                    query: action.payload.search,
                    totalPages: null,
                },
            };    
        case actions[2]:
            const url = action.payload.url;
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
        case actions[3]:
            const { payload } = action;
            return {
                ...state,
                search: {
                    ...state.search,
                    count: payload.count,
                    currentPage: payload.currentPage,
                    perPage: payload.perPage,
                    isFetching: false,
                    links: payload.links,
                    matches: payload.matches,
                    totalPages: payload.totalPages,
                },
            };
        case actions[4]:
            return {
                ...state,
                search: {
                    ...state.search,
                    errorMessage: action.payload,
                    isFetching: false,
                },
            };
        case actions[5]:
            return initialState;
    }
    return state;
}

    