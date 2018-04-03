
import { call, put, takeLatest } from 'redux-saga/effects';
import Amplify from 'aws-amplify';
import { GET_CONFIG, RECEIVED_CONFIG, LOG_IN_SUCCESS } from '../constants/actions';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import checkStatus from '../util/checkStatus';
import parseJSON from '../util/parseJSON';
import AWS from 'aws-sdk';

export default function* listenForGetConfig() {
  yield takeLatest(GET_CONFIG, getConfig);
}

function* getConfig() {
  if(useAuth()){
    const payload = yield call(fetchConfig);
    yield call( setupAuth, payload );
    yield call( configureAWS, payload );
    yield put({ type: RECEIVED_CONFIG, payload });
  }else{
    yield put({ type: RECEIVED_CONFIG });
    yield call( configureAWS, appConfig.AWSConfig );
    yield put({
      type: LOG_IN_SUCCESS,
      payload: {
        username: appConfig.username
      }
    });
  }
}

function configureAWS(config){
  return new Promise((resolve) =>{
    AWS.config.update({
      region: config.Region,
      credentials: useAuth() ?
      new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.IdentityPoolId
      }) :
      {
        accessKeyId:'hjkjhkj',
        secretAccessKey: '68767ytytuy'
      }
    });
    resolve();
  });
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

