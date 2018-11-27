
import {
  INIT,
  CONFIGURE_AWS_SUCCESS,
  CONFIGURE_AWS_FAILURE
} from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [CONFIGURE_AWS_SUCCESS]: (state, action) => ({ ...action.payload}),
  [CONFIGURE_AWS_FAILURE]: (state, action) => ({ ...action.payload}),
};

export const creds = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
