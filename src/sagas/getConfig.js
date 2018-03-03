import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_CONFIG, RECEIVED_CONFIG } from '../constants/actions';

export default function* listenForGetConfig() {
  yield takeLatest(GET_CONFIG, getConfig);
}

function* getConfig() {
  const payload = yield call(fetchConfig);
  yield put({
    type: RECEIVED_CONFIG,
    payload
  });
}
function fetchConfig() {
  return fetch(`http://localhost:3000/foto/config`, {
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
