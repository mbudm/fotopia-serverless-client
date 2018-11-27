import { call, put, select, takeLatest } from 'redux-saga/effects';
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import {
  CONFIGURE_AWS,
  CONFIGURE_AWS_SUCCESS,
  CONFIGURE_AWS_FAILURE
} from '../constants/actions';
import selectConfig from '../selectors/config';

export function* listenForConfigureAWS() {
  yield takeLatest(CONFIGURE_AWS, configure);
}

export default function* configure(action) {
  try {
    const config = yield select(selectConfig);
    const creds = yield call(getUserCreds);
    yield call(configureAWS, config, creds);
    yield put({ type: CONFIGURE_AWS_SUCCESS, payload: creds });
  } catch(e){
    yield put({ type: CONFIGURE_AWS_FAILURE, payload: { payload: action.payload, error: e }});
  }
}

function getUserCreds(){
  return Auth.currentUserCredentials()
}

function configureAWS(config, creds){
  return new Promise((resolve) =>{
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId
    });
    AWS.config.update({
      region: config.Region,
      credentials: creds,
    });

    console.log('credentials', creds);
    resolve(credentials);
  });
  //return credentials.getPromise();
}
