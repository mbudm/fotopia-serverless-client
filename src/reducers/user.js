import { INIT, LOG_IN_SUCCESS, LOG_OUT, LOG_IN_FAILURE } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [LOG_IN_SUCCESS]: (state, action) => {
    return { ...state, ...action.payload };
  },
  [LOG_IN_FAILURE]: (state, action) => {
    return { ...state, error: action.error };
  },
  [LOG_OUT]: (state, action) => ({})
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
