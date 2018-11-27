
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';
import { UPLOAD, CREATED_IMAGE_RECORDS, SEARCH } from '../constants/actions';
import { HOME } from '../constants/routes';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import * as api from './api';
import * as schemaKeys from '../constants/schemas';
import { CREATE } from '../constants/api';
import { validate } from './schemas';
import selectFilters from '../selectors/filters';

export default function* listenForUpload() {
  yield takeLatest(UPLOAD, upload);
}

function* upload(action) {

  const info = yield select(getUserInfo);

  const uploadedImages = yield all(action.payload.map(image => call( api.upload, image, info.username )));
  const createdImages = yield all(uploadedImages.map(s3ResponseAndImage => call( createFoto, s3ResponseAndImage, info )));
  yield put({ type: CREATED_IMAGE_RECORDS,  payload: createdImages});
  const filters = yield select(selectFilters);
  yield put({type: SEARCH, payload: {...filters}});
  yield put(navigate(HOME));
}

export function getUserInfo(state){
  return useAuth() ? state.cognitoUser : {
    username: appConfig.username,
    id: appConfig.username //something in place of cognito user id
  };
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
