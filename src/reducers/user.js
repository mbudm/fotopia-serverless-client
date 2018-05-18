import { INIT, LOG_IN_SUCCESS } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [LOG_IN_SUCCESS]: (state, action) => ({ ...action.payload, cognitoUser: action.payload})
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
