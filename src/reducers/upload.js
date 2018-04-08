import { INIT, CREATED_IMAGE_RECORDS } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [CREATED_IMAGE_RECORDS]: (state, action) => (
    {
      images: action.payload
    }
  )
};

export const upload = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
