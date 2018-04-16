
import { call, put, takeLatest, select } from 'redux-saga/effects';
import Amplify, { Storage } from 'aws-amplify';
import fetch from 'isomorphic-fetch';
import { SEARCH, SEARCH_RESULTS } from '../constants/actions';
import appConfig from '../appConfig';
import checkStatus from '../util/checkStatus';
import parseJSON from '../util/parseJSON';
import useAuth from '../util/useAuth';
import { ENDPOINT_NAME } from '../constants/api';

export default function* listenForSearch() {
  yield takeLatest(SEARCH, queryFotos);
}

function* queryFotos() {
  const username = yield select(selectUsername);
  const results = yield call( fetchFotos, username );
  yield put({ type: SEARCH_RESULTS,  payload: results});
}

function getImageSource(result){
  return Storage.get(result.img_key, { level: 'private' })
    .then((img_location) => ({
      ...result,
      img_location
    }));
}

function fetchFotos(username){
  const query = {
    username,
    criteria: {
      tags: [],
      people: [],
    },
    from: '2004-04-04',
    to: Date.now(),
  };

  if(useAuth()){
    return Amplify.API.post(ENDPOINT_NAME, appConfig.query, { body: query })
      .then(results => Promise.all(results.map(getImageSource)));
  }else{
    return fetch(appConfig.query, {
      method: 'POST',
      body: JSON.stringify(query)
    })
    .then(checkStatus)
    .then(parseJSON);
  }
}

const selectUsername = (state) => state.user.username;
