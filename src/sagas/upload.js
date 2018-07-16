
import { all, call, put, takeLatest } from 'redux-saga/effects';
import Amplify from 'aws-amplify';
import { navigate } from 'redux-saga-first-router';
import { UPLOAD, CREATED_IMAGE_RECORDS, SEARCH } from '../constants/actions';
import { HOME } from '../constants/routes';
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

  let info;
  if(useAuth()){
    info = yield call(getUserInfo);
  }else{
    info = {
      username: appConfig.username,
      id: appConfig.username //something in place of cognito user id
    }
  }
  const uploadedImages = yield all(action.payload.map(image => call( api.upload, image, info.username )));
  const createdImages = yield all(uploadedImages.map(s3ResponseAndImage => call( createFoto, s3ResponseAndImage, info )));
  yield put({ type: CREATED_IMAGE_RECORDS,  payload: createdImages});
  yield put({type: SEARCH});
  yield put(navigate(HOME));
}

function getUserInfo(){
  const auth = Amplify.Auth;
  return auth.currentUserInfo();
}
function resolveKey(s3ResponseAndImage){
  return s3ResponseAndImage.s3.key || s3ResponseAndImage.s3.Key;
}

function createFoto(s3ResponseAndImage, info){
  const params = {
    username: info.username,
    userIdentityId: info.id,
    birthtime: s3ResponseAndImage.imageObject.file.lastModified,
    img_key: resolveKey(s3ResponseAndImage),
    people: [],
    tags: s3ResponseAndImage.imageObject.tags || [],
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
