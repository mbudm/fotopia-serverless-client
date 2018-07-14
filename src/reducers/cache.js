import { INIT, CACHED_LOAD } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({  serviceWorkerUpdated: false }),
  [CACHED_LOAD]: (state, action) => {
    return { ...state,
      serviceWorkerUpdated: true };
  }
};

export const cache = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
