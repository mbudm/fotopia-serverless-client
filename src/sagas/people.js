
import { call, put, takeLatest } from 'redux-saga/effects';
import { Storage } from 'aws-amplify';
import * as api from './api';
import { GET_PEOPLE, PEOPLE_RESULT, PEOPLE_FAILURE } from '../constants/actions';
import { PEOPLE_PATH } from '../constants/api';
import useAuth from '../util/useAuth';
import appConfig from '../appConfig';

export default function* listenForGetIndexes() {
  yield takeLatest(GET_PEOPLE, getPeople);
}

function* getPeople(action) {
  try {
    const result = yield call( fetchPeople);
    yield put({ type: PEOPLE_RESULT,  payload: result});
  } catch(e) {
    yield put({ type: PEOPLE_FAILURE,  payload: e});
  }
}


export function getImageSource(result){
  return Storage.get(result.thumbnail, {
    level: 'protected',
    identityId: result.userIdentityId
  }).then(location => ({
    ...result,
    thumbnail_location: location,
  }));
}

function fetchPeople(){
  if(useAuth()){
    return api.get(PEOPLE_PATH)
      .then(results => {
        return Array.isArray(results) ? Promise.all(results.map(getImageSource)) : results ;
      });
  }else{
    return api.get(PEOPLE_PATH)
      .then((results) => {
        console.log(results);
        return Array.isArray(results) ? results.map((result) => {
          const thumbnail_location = `${appConfig.s3Url}/${appConfig.s3Bucket}/${result.thumbnail}`;
          return {
            ...result,
            thumbnail_location,
          }
        }): results;
    });
  }
}
