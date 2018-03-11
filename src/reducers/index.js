import { combineReducers } from 'redux';
import { reducer as routerReducer} from 'redux-saga-first-router';

import { config } from './config';
import { user } from './user';

const reducers = combineReducers({
  config,
  user,
  router: routerReducer
});

export default reducers;
