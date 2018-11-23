import { INIT, SW_UPDATE } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({  serviceWorkerUpdated: false }),
  [SW_UPDATE]: (state, action) => {
    return { ...state,
      serviceWorkerUpdated: true };
  }
};

export const cache = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
