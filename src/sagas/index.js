import { all, fork, put, select, takeLatest } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';
import { INIT, GET_CONFIG, LOG_IN_SUCCESS, GET_INDEXES, GET_PEOPLE } from '../constants/actions';
import listenForGetConfig from './getConfig';
import listenForSearch from './search';
import listenForUpload from './upload';
import listenForGetFoto from './get';
import listenForGetIndexes from './indexes';
import {
  listenForGetPeople,
  listenForUpdatePerson
} from './people';
import listenForCachedLoad from './cache';

import {
  listenForLogIn,
  listenForChangePassword,
  listenForLogOut
} from './user';
import selectRoute from '../selectors/route';

export default function* root() {
  yield all([
    fork(listenForCachedLoad),
    fork(listenForGetConfig),
    fork(listenForLogIn),
    fork(listenForLoginSuccess),
    fork(listenForChangePassword),
    fork(listenForLogOut)
  ]);
  yield put({ type: INIT });
  yield put({ type: GET_CONFIG });
}

export function* listenForLoginSuccess(){
  yield takeLatest(LOG_IN_SUCCESS, onLoginSuccess);
}

function* onLoginSuccess(){
  yield all([
    fork(listenForSearch),
    fork(listenForUpload),
    fork(listenForGetFoto),
    fork(listenForGetIndexes),
    fork(listenForGetPeople),
    fork(listenForUpdatePerson)
  ]);
  const route = yield select(selectRoute);
  yield put(navigate(route.id, route.params));

  //lazy load handy data
  yield all([
    put({ type: GET_INDEXES }),
    put({ type: GET_PEOPLE })
  ]);
}
