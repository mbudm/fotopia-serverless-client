
import { call, put, takeLatest } from 'redux-saga/effects';
import { UPLOAD, UPLOADED_IMAGE } from '../constants/actions';
import appConfig from '../appConfig';
import AWS from 'aws-sdk';
import Amplify from 'aws-amplify';
import useAuth from '../util/useAuth';
import { navigate } from 'redux-saga-first-router';

export default function* listenForUpload() {
  yield takeLatest(UPLOAD, upload);
}

function* upload(action) {
  let creds;
  let info;
  if(useAuth()){
    creds = yield call(getCredentials);
    info = yield call(getUserInfo);
  }
  const image = yield call( uploadFoto, action.payload, creds, info );
  yield put({ type: UPLOADED_IMAGE,  payload: image});
  yield put(navigate('CREATE'));
}

function getCredentials(){
  return Amplify.Auth.currentCredentials();
}

function getUserInfo(){
  const auth = Amplify.Auth;
  return auth.currentUserInfo();
}


function uploadFoto(file, credentials, info){
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
      Key: info.username + '/' +file.name,
      Bucket: appConfig.s3Bucket,
      Body: file,
      ContentType: 'image/jpeg',
    };

    client.upload(params, (err, data) => {
      if (err) {
        reject({ params, err });
      } else {
        resolve(data);
      }
    });
  })
  .then(validateResponse)
  .catch((e) => {
    console.error(e);
  });
}

function validateResponse(response){
  if (response && response.Location) {
    return response;
  }
  const error = new Error(`HTTP Error with s3 upload`);
  error.status = response.statusText;
  error.response = response;
  throw error;
}

/*
{
  Up to s3 cors error
  <Error><Code>AccessForbidden</Code><Message>CORSResponse: CORS is not enabled for this bucket.</Message><Method>PUT</Method><ResourceType>BUCKET</ResourceType><RequestId>FBC200BAB51F9D70</RequestId><HostId>FpsAaKetnunw4nCsrfQCjf0r2QOs05Ey7acclubr8+IdB9L8j1kDa+hoaEtRoIZnxy9tc2fiSfg=</HostId></Error>
}
*/
