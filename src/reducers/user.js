import { INIT, SIGN_IN, SIGN_OUT } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [SIGN_IN]: (state, action) => {
    return { ...state, ...action.payload };
  },
  [SIGN_OUT]: (state, action) => ({}),
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
