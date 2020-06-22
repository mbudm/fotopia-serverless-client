
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';
import { UPLOAD, UPLOADED_IMAGES, SEARCH } from '../constants/actions';
import { HOME } from '../constants/routes';
import * as api from './api';
import selectFilters from '../selectors/filters';

export default function* listenForUpload() {
  yield takeLatest(UPLOAD, upload);
}

function* upload(action) {
  const info = yield select(getUserInfo);
  const uploadedImages = yield all(action.payload.map(image => call( api.upload, image, info.username )));
  yield put({ type: UPLOADED_IMAGES,  payload: uploadedImages});
  const filters = yield select(selectFilters);
  yield put({type: SEARCH, payload: {...filters}});
  yield put(navigate(HOME));
}

export function getUserInfo(state){
  return {
    username: state.user.username,
    id: state.creds.params.IdentityId
  }
}
