
import { call, put, takeLatest } from 'redux-saga/effects';
import { Storage } from 'aws-amplify';
import * as api from './api';
import {
  GET_PEOPLE,
  GET_PEOPLE_SUCCESS,
  GET_PEOPLE_FAILURE,
  UPDATE_PERSON,
  UPDATE_PERSON_SUCCESS,
  UPDATE_PERSON_FAILURE
} from '../constants/actions';
import {
  PEOPLE_PATH,
  PERSON_PATH
} from '../constants/api';
import useAuth from '../util/useAuth';
import appConfig from '../appConfig';

export function* listenForGetPeople() {
  yield takeLatest(GET_PEOPLE, getPeople);
}

export function* listenForUpdatePerson() {
  yield takeLatest(UPDATE_PERSON, updatePerson);
}

function* getPeople(action) {
  try {
    const result = yield call( fetchPeople);
    yield put({ type: GET_PEOPLE_SUCCESS,  payload: result});
  } catch(e) {
    yield put({ type: GET_PEOPLE_FAILURE,  payload: e});
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


function* updatePerson(action) {
  try {
    const result = yield call( putPerson, action.payload);
    yield put({ type: UPDATE_PERSON_SUCCESS,  payload: result});
  } catch(e) {
    yield put({ type: UPDATE_PERSON_FAILURE,  payload: e});
  }
}

function putPerson(payload){
  if(useAuth()){
    return api.put(PERSON_PATH(payload.id), {
      body: payload,
    })
      .then(results => {
        return Array.isArray(results) ? Promise.all(results.map(getImageSource)) : results ;
      });
  }else{
    return api.put(PERSON_PATH(payload.id), {
      body: payload,
    })
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
