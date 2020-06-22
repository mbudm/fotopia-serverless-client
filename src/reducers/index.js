import { combineReducers } from 'redux';
import { reducer as routerReducer} from 'redux-saga-first-router';

import { auth } from './auth';
import { creds } from './creds';
import { user } from './user';
import { search } from './search';
import { upload } from './upload';
import { cache } from './cache';
import { indexes } from './indexes';
import { people } from './people';

const reducers = combineReducers({
  auth,
  creds,
  user,
  search,
  upload,
  cache,
  indexes,
  people,
  router: routerReducer
});

export default reducers;
