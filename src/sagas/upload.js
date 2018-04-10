
import { all, call, put, takeLatest } from 'redux-saga/effects';
import AWS from 'aws-sdk';
import Amplify from 'aws-amplify';
import { navigate } from 'redux-saga-first-router';
import { UPLOAD, CREATED_IMAGE_RECORDS } from '../constants/actions';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import * as api from './api';
import * as schemaKeys from '../constants/schemas';
import { validate } from './schemas';

export default function* listenForUpload() {
  yield takeLatest(UPLOAD, upload);
}

function* upload(action) {
  let creds;
  let info = {...appConfig};
  if(useAuth()){
    creds = yield call(getCredentials);
    info = yield call(getUserInfo);
  }

  const uploadedImages = yield all(action.payload.map(image => call( uploadFoto, image, creds, info )));
  const createdImages = yield all(uploadedImages.map(image => call( createFoto, image, creds, info )));
  yield put({ type: CREATED_IMAGE_RECORDS,  payload: createdImages});
  yield put(navigate('UPDATE'));
}

function getCredentials(){
  return Amplify.Auth.currentCredentials();
}

function getUserInfo(){
  const auth = Amplify.Auth;
  return auth.currentUserInfo();
}


function uploadFoto(imageObject, credentials, info){
  return new Promise((resolve, reject) => {
    const config = {
      s3ForcePathStyle: true,
    };
    if (credentials){
      config.credentials = credentials;
    }
    if (appConfig.s3Url) {
      config.endpoint = new AWS.Endpoint(appConfig.s3Url);
    }

    const client = new AWS.S3(config);

    const params = {
      Key: `${info.username}/${imageObject.file.name}`,
      Bucket: appConfig.s3Bucket,
      Body: imageObject.file,
      ContentType: imageObject.file.type,
    };

    client.upload(params, (err, s3Response) => {
      if (err) {
        reject({ params, err });
      } else {
        resolve({
          imageObject,
          s3: s3Response
        });
      }
    });
  })
  .then(validateResponse)
  .catch((e) => {
    console.error(e);
  });
}

function validateResponse(response){
  if (response && response.s3 && response.s3.Location) {
    return response;
  }
  const error = new Error(`HTTP Error with s3 upload`);
  error.status = response.s3.statusText;
  error.response = response.s3;
  throw error;
}


function createFoto(s3FileObj, credentials, info){
  const params = {
    username: info.username,
    birthtime: s3FileObj.imageObject.file.lastModified,
    img_location: s3FileObj.s3.Location,
    img_key: s3FileObj.s3.Key,
    people: [],
    tags: [],
    meta: {
      ...s3FileObj.imageObject.file,
      width: s3FileObj.imageObject.width,
      height: s3FileObj.imageObject.height,
    }
  };
  const data = validate(params, schemaKeys.CREATE_REQUEST);
  return api.post('create', {
    body: data,
  });
}
