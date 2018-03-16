import { select, put } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';

import selectUploadImage from '../selectors/uploadImage';

export function* editNavigate() {

}

export function* uploadNavigate() {

}

export function* createNavigate() {
  const image = yield select(selectUploadImage);
  if(!image){
    yield put(navigate('UPLOAD'));
  }
}
