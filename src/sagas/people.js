
import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import { GET_PEOPLE, PEOPLE_RESULT, PEOPLE_FAILURE } from '../constants/actions';
import { PEOPLE_PATH } from '../constants/api';

export default function* listenForGetIndexes() {
  yield takeLatest(GET_PEOPLE, getPeople);
}

function* getPeople(action) {
  try {
    const result = yield call( fetchPeople);
    yield put({ type: PEOPLE_RESULT,  payload: result});
  } catch(e) {
    yield put({ type: PEOPLE_FAILURE,  payload: e});
  }
}

function fetchPeople(){
  return api.get(PEOPLE_PATH);
}
