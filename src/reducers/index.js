import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { config } from './config';
import { user } from './user';

const reducers = combineReducers({
  config,
  user,
  router: routerReducer
});

export default reducers;
