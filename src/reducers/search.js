import {
  INIT,
  SEARCH,
  SEARCH_RESULTS,
  SEARCH_FAILURE,
  SEARCH_FILTERS,
  SEARCH_HEADER_TOGGLE,
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [SEARCH]: (state, action) => ({
    ...state,
    isLoading: true
  }),
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
  [SEARCH_FILTERS]: (state, action) => (
    {
      ...state,
      filters: {
        ...state.filters,
        ...action.payload,
        criteria: {
          tags: action.payload.criteria.tags || [],
          people: action.payload.criteria.people || [],
        },
      }
    }
  ),
  [SEARCH_HEADER_TOGGLE]: (state, action) => (
    {
      ...state,
      searchHeaderOpen: action.payload
    }
  )
};

export const search = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
