import {
  INIT,
  INDEXES_RESULT,
  INDEXES_FAILURE,
  GET_INDEXES
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [GET_INDEXES]: (state, action) => (
    {
      ...state,
      isLoading: true
    }
  ),
  [INDEXES_RESULT]: (state, action) => (
    {
      ...state,
      ...action.payload,
      isLoading: false,
      error: null
    }
  ),
  [INDEXES_FAILURE]: (state, action) => (
    {
      ...state,
      isLoading: false,
      error: action.payload
    }
  ),
}

export const indexes = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
