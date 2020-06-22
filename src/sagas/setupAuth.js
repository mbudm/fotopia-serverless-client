
import { call, put, takeLatest } from 'redux-saga/effects';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { SET_UP_AUTH, AUTH_SET_UP, LOG_IN_SUCCESS } from '../constants/actions';
import appConfig from '../appConfig';
import { ENDPOINT_NAME } from '../constants/api';

export default function* listenForSetupAuth() {
  yield takeLatest(SET_UP_AUTH, setupAuth);
}

function* setupAuth() {
  try{
    yield call( setupAmplify );
    yield put({type: AUTH_SET_UP})
    const user = yield call(getUser);
    if(user){
      yield put({
        type: LOG_IN_SUCCESS,
        payload: user
      });
    }
  } catch(e){
    console.log(e);
  }
}

function getUser(){
  return Auth.currentAuthenticatedUser();
}

function setupAmplify(){
  return new Promise((resolve) =>{
    Amplify.configure({
      Auth: {
        identityPoolId: appConfig.IdentityPoolId,
        region: appConfig.Region,
        userPoolId: appConfig.UserPoolId,
        userPoolWebClientId: appConfig.UserPoolClientId,
      },
      Storage: {
        region: appConfig.Region,
        bucket: appConfig.Bucket,
        identityPoolId: appConfig.IdentityPoolId,
      },
      API: {
        endpoints: [
          {
            name: ENDPOINT_NAME,
            endpoint: appConfig.ServiceEndpoint,
            region: appConfig.Region,
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
