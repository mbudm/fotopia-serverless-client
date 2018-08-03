import {
  INIT,
  PEOPLE_RESULT,
  PEOPLE_FAILURE,
  GET_PEOPLE
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [GET_PEOPLE]: (state, action) => (
    {
      ...state,
      isLoading: true
    }
  ),
  [PEOPLE_RESULT]: (state, action) => (
    {
      ...state,
      results: action.payload,
      isLoading: false,
      error: null
    }
  ),
  [PEOPLE_FAILURE]: (state, action) => (
    {
      ...state,
      isLoading: false,
      error: action.payload
    }
  ),
}

export const people = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
