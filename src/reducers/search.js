import {
  INIT,
  SEARCH_RESULTS,
  INDEXES_RESULT,
  SEARCH_FAILURE,
  SEARCH_FILTERS
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [SEARCH_RESULTS]: (state, action) => (
    {
      ...state,
      results: action.payload
    }
  ),
  [SEARCH_FAILURE]: (state, action) => (
    {
      ...action.payload
    }
  ),
  [INDEXES_RESULT]: (state, action) => (
    {
      ...state,
      indexes: action.payload
    }
  ),
  [SEARCH_FILTERS]: (state, action) => (
    {
      ...state,
      filters: action.payload
    }
  ),
};

export const search = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
