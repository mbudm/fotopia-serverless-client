import {
  INIT,
  SEARCH_RESULTS,
  INDEXES_RESULT
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [SEARCH_RESULTS]: (state, action) => (
    {
      ...state,
      results: action.payload
    }
  ),
  [INDEXES_RESULT]: (state, action) => (
    {
      ...state,
      indexes: action.payload
    }
  ),
};

export const search = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
