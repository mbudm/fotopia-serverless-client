
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import { GET_FOTO, SEARCH_RESULTS } from '../constants/actions';
import { FOTO_PATH } from '../constants/api';
import selectUsername from '../selectors/username';
import { getImageSource } from './search';

export default function* listenForGetFoto() {
  yield takeLatest(GET_FOTO, getFoto);
}

function* getFoto(action) {
  try {
    const username = yield select(selectUsername);
    const result = yield call( fetchFoto, username, action.payload);
    yield put({ type: SEARCH_RESULTS,  payload: [result]});
  } catch(e) {
    console.error(e)
  }
}

function fetchFoto(username, id){
  const fotoPath = FOTO_PATH(username,id);
  return api.get(fotoPath)
    .then(getImageSource);
}
