import fetch from 'isomorphic-fetch';
import AWS from 'aws-sdk';
import { API, Storage } from 'aws-amplify';
import useRemoteApi from '../util/useRemoteApi';
import { ENDPOINT_NAME } from '../constants/api';
import appConfig from '../appConfig';

const createKey = (username, filename) => `${username}/${filename}`;

const postRemote = (route, params) => API.post(ENDPOINT_NAME, route, params);
const putRemote = (route, params) => API.put(ENDPOINT_NAME, route, params);
const getRemote  = (route) => API.get(ENDPOINT_NAME, route);
const delRemote  = (route) => API.del(ENDPOINT_NAME, route);
const uploadRemote = (imageObject, username) => {
  const key = createKey(username, imageObject.file.name);
  const options = {
    contentType: imageObject.file.type,
    level: 'protected'
  };
  return Storage.put(key, imageObject.file, options)
  .then((s3Response) => ({
    imageObject,
    s3: s3Response
  }));
}

const listRemote = (path, username) => {
  const options = {
    level: 'protected'
  };
  return Storage.list(path, options);
}

const handleError = e => console.error(e);

function uploadLocal(imageObject, username){
  return new Promise((resolve, reject) => {
    const config = {
      s3ForcePathStyle: true,
      endpoint: new AWS.Endpoint(appConfig.s3Url)
    };

    const client = new AWS.S3(config);

    const params = {
      Key: createKey(username, imageObject.file.name),
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
  .catch(handleError);
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

function postLocal(route, params) {
  return fetch(`${appConfig.api}${route}`, {
    method: 'POST',
    body: JSON.stringify(params.body),
  })
    .then(response => response.json())
    .catch(handleError);
}

function putLocal(route, params) {
  return fetch(`${appConfig.api}${route}`, {
    method: 'PUT',
    body: JSON.stringify(params.body),
  })
    .then(response => response.json())
    .catch(handleError);
}

function getLocal(route) {
  return fetch(`${appConfig.api}${route}`)
    .then(response => response.json())
    .catch(handleError);
}

function delLocal(route) {
  return fetch(`${appConfig.api}${route}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .catch(handleError);
}

export const post = useRemoteApi() ? postRemote : postLocal ;
export const put = useRemoteApi() ? putRemote : putLocal ;
export const get = useRemoteApi() ? getRemote : getLocal ;
export const del = useRemoteApi() ? delRemote : delLocal ;
export const upload = useRemoteApi() ? uploadRemote : uploadLocal ;
export const list = useRemoteApi() ? listRemote : null ;
