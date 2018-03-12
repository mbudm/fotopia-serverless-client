import { combineReducers } from 'redux';
import { reducer as routerReducer} from 'redux-saga-first-router';

import { config } from './config';
import { user } from './user';
import { search } from './search';

const reducers = combineReducers({
  config,
  user,
  search,
  router: routerReducer
});

export default reducers;
