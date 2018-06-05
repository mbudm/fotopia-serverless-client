
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { Auth } from "aws-amplify";
import { navigate } from 'redux-saga-first-router';
import {
  LOG_IN,
  LOG_OUT,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  CHANGE_PASSWORD
} from '../constants/actions';
import {
  HOME
} from '../constants/routes';
import selectRoute from '../selectors/route';


const getCognitoUser = (state) => state.user.cognitoUser;

export function* listenForLogIn() {
  yield takeLatest(LOG_IN, logIn);
}

export function* listenForLogOut() {
  yield takeLatest(LOG_OUT, logOut);
}

export function* listenForChangePassword(){
  yield takeLatest(CHANGE_PASSWORD, changePassword);
}

export function* listenForLoginSuccess(){
  yield takeLatest(LOG_IN_SUCCESS, onLoginSuccess);
}

function* logIn(action) {
  try {
    const signedIn = yield call(amplifySignIn, action.payload);
    yield put({ type: LOG_IN_SUCCESS, payload: signedIn });
  } catch(e){
    yield put({ type: LOG_IN_FAILURE, payload: { creds: action.payload, error: e }});
  }
}

function* changePassword(action) {
  try {
    const cognitoUser = yield select(getCognitoUser);
    const updatedCognitoUser = yield call(amplifyChangePassword, cognitoUser, action.payload.password);
    yield put({ type: LOG_IN_SUCCESS, payload: updatedCognitoUser });
  } catch(e){
    yield put({ type: LOG_IN_FAILURE, payload: { creds: action.payload, error: e }});
  }
}

function* logOut(action) {
  try {
    yield call(amplifyLogOut);
    yield put({ type: LOG_OUT_SUCCESS});
    yield put(navigate(HOME));
  } catch(e){
    yield put({ type: LOG_OUT_FAILURE, payload: { error: e }});
  }
}

function* onLoginSuccess(action){
  const route = yield select(selectRoute);
  yield put(navigate(route));
}

function amplifyLogOut(){
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

function amplifySignIn(payload){
  return Auth.signIn(payload.username, payload.password);
}

function amplifyChangePassword(cognitoUser, newPassword){
  return Auth.completeNewPassword(cognitoUser, newPassword)
  // the user returned by completeNewPassword is a different
  // shape to currentAuthenticatedUser - annoyingly, eg username is
  // not present which I'm using to validate logged in state
  // so grab the user again
  .then(user => Auth.currentAuthenticatedUser());
}

