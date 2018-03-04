
import { call, put, takeLatest } from 'redux-saga/effects';
import Amplify from 'aws-amplify';
import { GET_CONFIG, RECEIVED_CONFIG, } from '../constants/actions';
import appConfig from '../appConfig';

export default function* listenForGetConfig() {
  yield takeLatest(GET_CONFIG, getConfig);
}

function* getConfig() {
  if( process.env.NODE_ENV === 'development'){
    yield put({ type: RECEIVED_CONFIG });
  }else{
    const payload = yield call(fetchConfig);
    yield call( setupAuth, payload );
    yield put({ type: RECEIVED_CONFIG });
  }
}

function setupAuth(config){
  Amplify.configure({
    Auth: {
      identityPoolId: config.IdentityPoolId,
      region: config.Region,
      userPoolId: config.UserPoolId,
      userPoolWebClientId: config.UserPoolClientId,
    }
  });
}

function fetchConfig() {
  return fetch(appConfig.getConfig, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON);
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}
