
import { call, put, takeLatest } from 'redux-saga/effects';
import Amplify from 'aws-amplify';
import AWS from 'aws-sdk';
import { GET_CONFIG, RECEIVED_CONFIG, LOG_IN_SUCCESS } from '../constants/actions';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import checkStatus from '../util/checkStatus';
import parseJSON from '../util/parseJSON';
import { CONFIG, ENDPOINT_NAME } from '../constants/api';

export default function* listenForGetConfig() {
  yield takeLatest(GET_CONFIG, getConfig);
}

function* getConfig() {
  if(useAuth()){
    const payload = yield call(fetchConfig);
    yield call( setupAuth, payload );
    yield call( configureAWS, payload );
    yield put({ type: RECEIVED_CONFIG, payload });
    try{
      const user = yield call(getUser);
      console.log('user', user)
      if(user){
        yield put({
          type: LOG_IN_SUCCESS,
          payload: user
        });
      }
    } catch(e){
      console.log(e);
    }

  }else{
    yield put({ type: RECEIVED_CONFIG });
    yield call( configureAWSlocal, appConfig.AWSConfig );
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
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId
    });
    AWS.config.update({
      region: config.Region,
      credentials,
    });
    resolve(credentials);
  });
  //return credentials.getPromise();
}
function getUser(){
  const auth = Amplify.Auth;
  return auth.currentAuthenticatedUser();
}
function configureAWSlocal(config){
  return new Promise((resolve) =>{
    AWS.config.update({
      region: config.Region,
      credentials: {
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
      },
      Storage: {
        region: config.Region,
        bucket: config.Bucket,
        identityPoolId: config.IdentityPoolId,
      },
      API: {
        endpoints: [
          {
            name: ENDPOINT_NAME,
            endpoint: appConfig.api,
            region: config.Region,
          },
        ],
      },
      Analytics: {
        disabled: true
      }
    });
    resolve();
  });
}

function fetchConfig() {
  const endpoint = `${appConfig.api}${CONFIG}`;
  return fetch(endpoint, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON);
}

