import API from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import { ENDPOINT_NAME } from '../constants/api';

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


export const post = postRemote;
export const put = putRemote;
export const get = getRemote;
export const del = delRemote;
export const upload = uploadRemote;
export const list = listRemote;
