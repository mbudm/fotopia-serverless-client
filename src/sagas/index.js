import { all, fork, put } from 'redux-saga/effects';
import { INIT, GET_CONFIG } from '../constants/actions';
import listenForGetConfig from './getConfig';
import listenForSearch from './search';

export default function* root() {
  yield all([
    fork(listenForGetConfig),
    fork(listenForSearch)
  ]);
  yield put({ type: INIT });
  yield put({ type: GET_CONFIG });
}
