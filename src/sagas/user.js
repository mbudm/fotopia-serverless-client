
import { call, put, takeLatest } from 'redux-saga/effects';
import { Auth } from "aws-amplify";
import { LOG_IN, LOG_OUT, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../constants/actions';


export function* listenForLogIn() {
  yield takeLatest(LOG_IN, logIn);
}

export function* listenForLogOut() {
  yield takeLatest(LOG_OUT, logOut);
}

function* logIn(action) {
  try {
    const signedIn = yield call(amplifySignIn, action.payload);
    yield put({ type: LOG_IN_SUCCESS, payload: signedIn });
  } catch(e){
    yield put({ type: LOG_IN_FAILURE, payload: action.payload });
  }
}

function* logOut(action) {
  yield put({ type: LOG_OUT, payload: action.payload });
}

function amplifySignIn(payload){
  return Auth.signIn(payload.email, payload.password);
}
