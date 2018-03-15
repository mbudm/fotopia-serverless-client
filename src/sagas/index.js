import { all, fork, put } from 'redux-saga/effects';
import { INIT, GET_CONFIG } from '../constants/actions';
import listenForGetConfig from './getConfig';
import listenForSearch from './search';
import listenForUpload from './upload';

export default function* root() {
  yield all([
    fork(listenForGetConfig),
    fork(listenForSearch),
    fork(listenForUpload)
  ]);
  yield put({ type: INIT });
  yield put({ type: GET_CONFIG });
}
