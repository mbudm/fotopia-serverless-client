import { INIT, UPLOADED_IMAGES } from '../constants/actions';

const ACTION_HANDLERS = {
  [INIT]: (state, action) => ({}),
  [UPLOADED_IMAGES]: (state, action) => (
    {
      images: action.payload
    }
  )
};

export const upload = (state = {}, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
