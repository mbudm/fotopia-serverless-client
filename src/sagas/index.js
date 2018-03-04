import { all, fork, put } from 'redux-saga/effects';
import { INIT, GET_CONFIG } from '../constants/actions';
import listenForGetConfig from './getConfig';

export default function* root() {
  yield all([
    fork(listenForGetConfig)
  ]);
  yield put({ type: INIT });
  yield put({ type: GET_CONFIG });
}
