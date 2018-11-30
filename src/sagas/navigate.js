import { take, select, put, call} from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';

import {
  SEARCH,
  SEARCH_RESULTS,
  GET_FOTO,
  GET_INDEXES,
  GET_PEOPLE,
  EXISTING_KEYS_SUCCESS,
  EXISTING_KEYS_FAILURE
} from '../constants/actions';
import {
  UPLOAD
} from '../constants/routes';
import {
  SIGNED_IN
} from '../constants/user'

import * as api from './api';
import selectUploadImage from '../selectors/uploadImage';
import selectSearchResults from '../selectors/searchResults';
import selectSearchResult from '../selectors/searchResult';
import signedInStatus from '../selectors/signedInStatus';
import selectUsername from '../selectors/username';


export function* uploadNavigate() {
  yield put({type: GET_INDEXES });
}

export function* detailNavigate({fotoid}) {
  const imageRecord = yield select(selectSearchResult, fotoid);
  if(!imageRecord){
    yield put({type: GET_FOTO, payload: fotoid});
  }
}

export function* peopleNavigate(){
  yield put({type: GET_PEOPLE});
}

export function shouldPerformSearch(state){
  const signedIn = signedInStatus(state)
  const results = selectSearchResults(state)
  return signedIn === SIGNED_IN && results.length === 0 && !state.search.isLoading;
}

export function* homeNavigate(){
  const shouldSearch = yield select(shouldPerformSearch)
  if(shouldSearch){
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
