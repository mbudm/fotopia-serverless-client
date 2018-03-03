import { combineReducers } from 'redux';
import { config } from './config';
import { user } from './user';

const reducers = combineReducers({
  config,
  user
});

export default reducers;
