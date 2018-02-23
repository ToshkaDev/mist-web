import * as Gene from './gene.actions';

export interface State {
    fetch: {
      errorMessage: string;
      gene: any;
    };
}

const initialState: State = {
  fetch: {
      errorMessage: null,
      gene: null,
    },
};

export function reducer (state = initialState, action: Gene.Actions){
    switch (action.type) {
        case Gene.FETCH_GENE_DONE:
        const { payload } = action;
        return {
          ...state,
          fetch: {
            ...state.fetch,
            gene: payload.fetchedGene            
          }
        };

        case Gene.FETCH_GENE_ERROR:
        return {
          ...state,
          fetch: {
            ...state.fetch,
            errorMessage: action.payload
          }
        };
    }
    return state;
}