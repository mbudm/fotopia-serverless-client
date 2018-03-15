import { combineReducers } from 'redux';
import { reducer as routerReducer} from 'redux-saga-first-router';

import { config } from './config';
import { user } from './user';
import { search } from './search';
import { upload } from './upload';

const reducers = combineReducers({
  config,
  user,
  search,
  upload,
  router: routerReducer
});

export default reducers;
