import * as Gene from './gene.actions';

export interface State {
    fetch: {
      errorMessage: string;
      gene: any;
      neighbourGenes: any[];
    };
}

const initialState: State = {
  fetch: {
      errorMessage: null,
      gene: null,
      neighbourGenes: []
    }
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
        case Gene.FETCH_NEIGHBOUR_GENES_DONE:
          return {
            ...state,
            fetch: {
              ...state.fetch,
              neighbourGenes: action.payload.neighbourGenes       
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