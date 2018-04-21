
import { all, call, put, takeLatest } from 'redux-saga/effects';
import Amplify from 'aws-amplify';
import { navigate } from 'redux-saga-first-router';
import { UPLOAD, CREATED_IMAGE_RECORDS } from '../constants/actions';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import * as api from './api';
import * as schemaKeys from '../constants/schemas';
import { CREATE } from '../constants/api';
import { validate } from './schemas';

export default function* listenForUpload() {
  yield takeLatest(UPLOAD, upload);
}

function* upload(action) {

  let { username } = appConfig;
  if(useAuth()){
    const info = yield call(getUserInfo);
    username = info.username;
  }
  const uploadedImages = yield all(action.payload.map(image => call( api.upload, image, username )));
  const createdImages = yield all(uploadedImages.map(s3ResponseAndImage => call( createFoto, s3ResponseAndImage, username )));
  yield put({ type: CREATED_IMAGE_RECORDS,  payload: createdImages});
  yield put(navigate('HOME'));
}

function getUserInfo(){
  const auth = Amplify.Auth;
  return auth.currentUserInfo();
}
function resolveKey(s3ResponseAndImage){
  return s3ResponseAndImage.s3.key || s3ResponseAndImage.s3.Key;
}

function createFoto(s3ResponseAndImage, username){
  const params = {
    username,
    birthtime: s3ResponseAndImage.imageObject.file.lastModified,
    img_key: resolveKey(s3ResponseAndImage),
    people: [],
    tags: [],
    meta: {
      ...s3ResponseAndImage.imageObject.file,
      width: s3ResponseAndImage.imageObject.width,
      height: s3ResponseAndImage.imageObject.height,
    }
  };
  const data = validate(params, schemaKeys.CREATE_REQUEST);
  return api.post(CREATE, {
    body: data,
  });
}
