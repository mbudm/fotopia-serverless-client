import fetch from 'isomorphic-fetch';
import { API } from 'aws-amplify';
import useRemoteApi from '../util/useRemoteApi';
import { ENDPOINT_NAME } from '../constants/api';
import appConfig from '../appConfig';

const postRemote = (route, params) => API.post(ENDPOINT_NAME, route, params);
const getRemote  = (route) => API.get(ENDPOINT_NAME, route);
const delRemote  = (route) => API.del(ENDPOINT_NAME, route);

const handleError = e => console.error(e);

function postLocal(route, params) {
  return fetch(`${appConfig.api}${route}`, {
    method: 'POST',
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
export const get = useRemoteApi() ? getRemote : getLocal ;
export const del = useRemoteApi() ? delRemote : delLocal ;
