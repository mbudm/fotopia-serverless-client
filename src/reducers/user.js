import { INIT } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({})
};

export const user = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
