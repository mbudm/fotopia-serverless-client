import { all, fork, put } from 'redux-saga/effects';
import { GET_CONFIG } from '../constants/actions';
import listenForGetConfig from './getConfig';

export default function* root() {
  yield all([fork(listenForGetConfig)]);

  yield put({ type: GET_CONFIG });
}
