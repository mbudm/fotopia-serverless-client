
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { Storage } from 'aws-amplify';
import * as api from './api';
import { SEARCH, SEARCH_RESULTS } from '../constants/actions';
import { QUERY } from '../constants/api';
import checkStatus from '../util/checkStatus';
import parseJSON from '../util/parseJSON';
import useAuth from '../util/useAuth';

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
    return api.post(QUERY, { body: query })
      .then(results => Promise.all(results.map(getImageSource)));
  }else{
    return api.post(QUERY, { body: query })
    .then(checkStatus)
    .then(parseJSON);
  }
}

const selectUsername = (state) => state.user.username;
