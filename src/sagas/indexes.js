
import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import { GET_INDEXES, INDEXES_RESULT } from '../constants/actions';
import { INDEXES_PATH } from '../constants/api';

export default function* listenForGetIndexes() {
  yield takeLatest(GET_INDEXES, getIndexes);
}

function* getIndexes(action) {
  try {
    const result = yield call( fetchIndexes);
    yield put({ type: INDEXES_RESULT,  payload: result});
  } catch(e) {
    console.error(e)
  }
}

function fetchIndexes(){
  return api.get(INDEXES_PATH);
}
