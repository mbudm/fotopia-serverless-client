
import { call, put, takeLatest } from 'redux-saga/effects';
import Amplify from 'aws-amplify';
import { GET_CONFIG, RECEIVED_CONFIG, USER_DATA } from '../constants/actions';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import checkStatus from '../util/checkStatus';
import parseJSON from '../util/parseJSON';
import uuid from 'uuid';

export default function* listenForGetConfig() {
  yield takeLatest(GET_CONFIG, getConfig);
}

function* getConfig() {
  if(useAuth()){
    const payload = yield call(fetchConfig);
    yield call( setupAuth, payload );
    yield put({ type: RECEIVED_CONFIG });
  }else{
    yield put({ type: RECEIVED_CONFIG });
    yield put({
      type: USER_DATA,
      payload: {
        userId: appConfig.userId || uuid.v1()
      }
    });
  }
}

function setupAuth(config){
  return new Promise((resolve) =>{
    Amplify.configure({
      Auth: {
        identityPoolId: config.IdentityPoolId,
        region: config.Region,
        userPoolId: config.UserPoolId,
        userPoolWebClientId: config.UserPoolClientId,
      }
    });
    resolve();
  });
}

function fetchConfig() {
  console.log('getconfig', appConfig);
  return fetch(appConfig.getConfig, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON);
}

