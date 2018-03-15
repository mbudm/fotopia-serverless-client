import { INIT, UPLOADED_IMAGE } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [UPLOADED_IMAGE]: (state, action) => (
    {
      image: action.payload
    }
  )
};

export const upload = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
