import { INIT, USER_DATA } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [USER_DATA]: (state, action) => ({ ...action.payload})
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
