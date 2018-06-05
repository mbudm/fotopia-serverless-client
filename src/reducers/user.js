import { INIT, LOG_IN_SUCCESS, LOG_OUT_SUCCESS } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [LOG_IN_SUCCESS]: (state, action) => ({ ...action.payload, cognitoUser: action.payload}),
  [LOG_OUT_SUCCESS]: (state, action) => ({}),
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
