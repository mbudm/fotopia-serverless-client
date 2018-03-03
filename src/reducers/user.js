import { INIT, LOG_IN, LOG_OUT } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [LOG_IN]: (state, action) => {
    return { ...state, ...action.payload };
  },
  [LOG_OUT]: (state, action) => ({})
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
