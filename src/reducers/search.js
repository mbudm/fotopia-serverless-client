import {
  INIT,
  SEARCH,
  SEARCH_RESULTS,
  INDEXES_RESULT,
  SEARCH_FAILURE,
  SEARCH_FILTERS
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [SEARCH]: (state, action) => ({isLoading: true}),
  [SEARCH_RESULTS]: (state, action) => (
    {
      ...state,
      results: action.payload,
      isLoading: false
    }
  ),
  [SEARCH_FAILURE]: (state, action) => (
    {
      ...state,
      ...action.payload,
      isLoading: false
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
