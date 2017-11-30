import * as Genome from './genome.actions';

export interface State {
    fetch: {
      errorMessage: string;
      genome: any;
    };
}

const initialState: State = {
  fetch: {
      errorMessage: null,
      genome: null,
    },
};

export function reducer (state = initialState, action: Genome.Actions){
    switch (action.type) {
        case Genome.FETCH_GENOME_DONE:
        const { payload } = action;
        return {
          ...state,
          fetch: {
            ...state.fetch,
            genome: payload.fetchedGenome            
          }
        };

        case Genome.FETCH_GENOME_ERROR:
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