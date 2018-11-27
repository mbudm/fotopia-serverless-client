import { all, fork, put, select, takeLatest } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';
import {
  INIT,
  GET_CONFIG,
  LOG_IN_SUCCESS,
  GET_INDEXES,
  GET_PEOPLE,
  CONFIGURE_AWS,
  CONFIGURE_AWS_SUCCESS
} from '../constants/actions';
import listenForGetConfig from './getConfig';
import listenForSearch from './search';
import listenForUpload from './upload';
import listenForGetFoto from './get';
import listenForDeleteFoto from './del';
import listenForGetIndexes from './indexes';
import {
  listenForGetPeople,
  listenForUpdatePerson,
  listenForMergePeople
} from './people';
import listenForCachedLoad from './cache';
import {
  listenForLogIn,
  listenForChangePassword,
  listenForLogOut
} from './user';
import {
  listenForConfigureAWS
} from './aws';
import selectRoute from '../selectors/route';

export default function* root() {
  yield all([
    fork(listenForCachedLoad),
    fork(listenForGetConfig),
    fork(listenForLogIn),
    fork(listenForLoginSuccess),
    fork(listenForConfigureAWSSuccess),
    fork(listenForChangePassword),
    fork(listenForLogOut),
    fork(listenForConfigureAWS)
  ]);
  yield put({ type: INIT });
  yield put({ type: GET_CONFIG });
}

export function* listenForLoginSuccess(){
  yield takeLatest(LOG_IN_SUCCESS, onLoginSuccess);
}

function* onLoginSuccess(){
  yield put({ type: CONFIGURE_AWS });
}

function* listenForConfigureAWSSuccess(){
  yield takeLatest(CONFIGURE_AWS_SUCCESS, onConfigureAWSSuccess);
}

function* onConfigureAWSSuccess(){
  yield all([
    fork(listenForSearch),
    fork(listenForUpload),
    fork(listenForGetFoto),
    fork(listenForDeleteFoto),
    fork(listenForGetIndexes),
    fork(listenForGetPeople),
    fork(listenForUpdatePerson),
    fork(listenForMergePeople)
  ]);
  const route = yield select(selectRoute);
  yield put(navigate(route.id, route.params));

  //lazy load handy data
  yield all([
    put({ type: GET_INDEXES }),
    put({ type: GET_PEOPLE })
  ]);
}
