import { combineReducers } from 'redux';
import { reducer as routerReducer} from 'redux-saga-first-router';

import { config } from './config';
import { user } from './user';
import { search } from './search';
import { upload } from './upload';
import { cache } from './cache';
import { indexes } from './indexes';

const reducers = combineReducers({
  config,
  user,
  search,
  upload,
  cache,
  indexes,
  router: routerReducer
});

export default reducers;
