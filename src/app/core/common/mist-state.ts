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
      scope: string;
      totalPages: number;
      searchPerforemd: boolean;
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
      scope: null,
      totalPages: null,
      searchPerforemd: false,
    },
  };

const genesActionTypes = [
    MistAction.SEARCH_GENES,
    MistAction.FETCH_GENES, 
    MistAction.FETCH_DONE_GENES, 
    MistAction.FETCH_ERROR_GENES, 
    MistAction.CLEAR_GENES
];
const genomesActionTypes = [
    MistAction.SEARCH_GENOMES,
    MistAction.FETCH_GENOMES, 
    MistAction.FETCH_DONE_GENOMES,
    MistAction.FETCH_ERROR_GENOMES, 
    MistAction.CLEAR_GENOMES
];
const genesShopCartActionTypes = [
    MistAction.GETBY_ID_LIST_GENES_SHOPCART,
    MistAction.FETCH_GENES_SHOPCART, 
    MistAction.FETCH_DONE_GENES_SHOPCART, 
    MistAction.FETCH_ERROR_GENES_SHOPCART, 
    MistAction.CLEAR_GENES_SHOPCART
];
const genomesShopCartActionTypes = [
    MistAction.GETBY_ID_LIST_GENOMES_SHOPCART,
    MistAction.FETCH_GENOMES_SHOPCART, 
    MistAction.FETCH_DONE_GENOMES_SHOPCART,
    MistAction.FETCH_ERROR_GENOMES_SHOPCART, 
    MistAction.CLEAR_GENOMES_SHOPCART
];
const scopeActionTypes = [
    MistAction.SEARCH_SCOPE,
    MistAction.FETCH_SCOPE, 
    MistAction.FETCH_DONE_SCOPE, 
    MistAction.FETCH_ERROR_SCOPE, 
    MistAction.CLEAR_SCOPE
];
const signalGenesTypes = [
    MistAction.GET_SIGNAL_GENES,
    MistAction.FETCH_SIGNAL_GENES, 
    MistAction.FETCH_DONE_SIGNAL_GENES, 
    MistAction.FETCH_ERROR_SIGNAL_GENES, 
    MistAction.CLEAR_SIGNAL_GENES
];

export function genomesReducer(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, genomesActionTypes);
}

export function genesReducer(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, genesActionTypes);
}

export function genomesReducerShopCart(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, genomesShopCartActionTypes);
}

export function genesReducerShopCart(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, genesShopCartActionTypes);
}

export function scopeReducer(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, scopeActionTypes);
}

export function signalGenesReducer(state = initialState, action: MistAction.Actions) {
    return reducer(state, action, signalGenesTypes);
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
                    scope: action.payload.scope,
                    totalPages: null,
                    searchPerforemd: false,
                },
            }; 
        case actions[1]:
            const url = action.payload.url;
            if (url) {
                return {
                    ...state,
                    search: {
                        ...state.search,
                        errorMessage: null,
                        isFetching: true,
                        matches: [],
                        searchPerforemd: false,
                    },
                };
            }
            break;
        case actions[2]:
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
                    searchPerforemd: true,
                },
            };
        case actions[3]:
            return {
                ...state,
                search: {
                    ...state.search,
                    errorMessage: action.payload.errorMessage,
                    isFetching: false,
                    searchPerforemd: false,
                },
            };
        case actions[4]:
            return {
                ...initialState,
                search: {
                    query: action.payload.query,
                    scope: action.payload.scope
                }
            };
    }
    return state;
}

    