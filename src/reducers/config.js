import { RECEIVED_CONFIG } from '../constants/actions';

const ACTION_HANDLERS = {
  [RECEIVED_CONFIG]: (state, action) => {
    return { ...state, received: true };
  }
};

export const config = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
