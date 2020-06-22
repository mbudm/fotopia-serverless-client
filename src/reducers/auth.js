import { AUTH_SET_UP} from '../constants/actions';

const ACTION_HANDLERS = {
  [AUTH_SET_UP]: (state) => {
    return { ...state, setup: true };
  }
};

export const auth = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
