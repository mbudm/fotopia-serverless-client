import { select, put, takeLatest } from 'redux-saga/effects';
import {
  SEARCH,
  SW_UPDATE,
  CACHED_LOAD_FAILURE
} from '../constants/actions';
import selectSearchResults from '../selectors/searchResults'
import selectRoute from '../selectors/route';
import {
  HOME
} from '../constants/routes';

export default function* listenForCachedLoad() {
  yield takeLatest(SW_UPDATE, handleCachedLoad);
}

const getRefreshSearch = (state) => {
  const results = selectSearchResults(state);
  const route = selectRoute(state);
  return results.length === 0 && route === HOME;
}

function* handleCachedLoad() {
  // if on home page and results 0 then do a search
  try {
    const refreshSearch = yield select(getRefreshSearch);
    if(refreshSearch){
      yield put({ type: SEARCH });
    }
  } catch(e){
    yield put({ type: CACHED_LOAD_FAILURE, payload: { error: e }});
  }
}
