import { take, select, put } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';

import {
  SEARCH,
  SEARCH_RESULTS
} from '../constants/actions';
import {
  UPLOAD
} from '../constants/routes';
import {
  SIGNED_IN
} from '../constants/user'

import selectUploadImage from '../selectors/uploadImage';
import selectSearchResults from '../selectors/searchResults';
import signedInStatus from '../selectors/signedInStatus';

export function* editNavigate() {

}

export function* uploadNavigate() {

}

export function* homeNavigate(){
  const signedIn = yield select(signedInStatus);
  const results = yield select(selectSearchResults);
  if(signedIn === SIGNED_IN && results.length === 0){
    yield put({type: SEARCH });
    yield take(SEARCH_RESULTS);
  }
}

export function* createNavigate() {
  const image = yield select(selectUploadImage);
  if(!image){
    yield put(navigate(UPLOAD));
  }
}
