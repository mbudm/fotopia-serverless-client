import { combineReducers } from 'redux';
import { reducer as routerReducer} from 'redux-saga-first-router';

import { config } from './config';
import { user } from './user';
import { search } from './search';
import { upload } from './upload';
import { cache } from './cache';

const reducers = combineReducers({
  config,
  user,
  search,
  upload,
  cache,
  router: routerReducer
});

export default reducers;
