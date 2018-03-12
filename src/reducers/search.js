import { INIT, SEARCH_RESULTS } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [SEARCH_RESULTS]: (state, action) => (
    {
      results: action.payload instanceof Array ? action.payload : []
    }
  )
};

export const search = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
