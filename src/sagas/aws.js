import { call, put, takeLatest } from 'redux-saga/effects';
import * as AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import {
  CONFIGURE_AWS,
  CONFIGURE_AWS_SUCCESS,
  CONFIGURE_AWS_FAILURE
} from '../constants/actions';
import appConfig from '../appConfig';

export function* listenForConfigureAWS() {
  yield takeLatest(CONFIGURE_AWS, configure);
}

export default function* configure(action) {
  try {
    const creds = yield call(getUserCreds);
    yield call(configureAWS, creds);
    yield put({ type: CONFIGURE_AWS_SUCCESS, payload: creds });
  } catch(e){
    yield put({ type: CONFIGURE_AWS_FAILURE, payload: { payload: action.payload, error: e }});
  }
}

function getUserCreds(){
  return Auth.currentUserCredentials()
}

function configureAWS(creds){
  return new Promise((resolve) =>{
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: appConfig.IdentityPoolId
    });
    AWS.config.update({
      region: appConfig.Region,
      credentials: creds,
    });
    resolve(credentials);
  });
}
