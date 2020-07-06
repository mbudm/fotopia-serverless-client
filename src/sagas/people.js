
import { call, put, takeLatest } from 'redux-saga/effects';
import Storage from '@aws-amplify/storage';
import * as api from './api';
import appConfig from '../appConfig';
import { configureStorage } from "./search";
import {
  GET_PEOPLE,
  GET_PEOPLE_SUCCESS,
  GET_PEOPLE_FAILURE,
  UPDATE_PERSON,
  UPDATE_PERSON_SUCCESS,
  UPDATE_PERSON_FAILURE,
  MERGE_PEOPLE,
  MERGE_PEOPLE_SUCCESS,
  MERGE_PEOPLE_FAILURE,
} from '../constants/actions';
import {
  PEOPLE_PATH,
  PERSON_PATH,
  PERSON_MERGE_PATH
} from '../constants/api';

export function* listenForGetPeople() {
  yield takeLatest(GET_PEOPLE, getPeople);
}

export function* listenForUpdatePerson() {
  yield takeLatest(UPDATE_PERSON, updatePerson);
}

export function* listenForMergePeople() {
  yield takeLatest(MERGE_PEOPLE, mergePeople);
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
  // switch to thumbs bucket
  configureStorage(appConfig.BucketGenerated);
  return Storage.get(result.thumbnail, {
    level: 'protected',
    identityId: result.userIdentityId
  }).then(location => {
    // reset Storage to img bucket
    configureStorage(appConfig.Bucket);
    return {
      ...result,
      thumbnail_location: location,
    }
  });
}

function fetchPeople(){
  return api.get(PEOPLE_PATH)
    .then(results => {
      return Array.isArray(results) ? Promise.all(results.map(getImageSource)) : results ;
    });
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
  return api.put(PERSON_PATH(payload.id), {
    body: payload,
  })
    .then(results => {
      return Array.isArray(results) ? Promise.all(results.map(getImageSource)) : results ;
    });
}

function* mergePeople(action){
  try {
    const result = yield call( peopleMerger, action.payload);
    yield put({ type: MERGE_PEOPLE_SUCCESS,  payload: result});
  } catch(e) {
    yield put({ type: MERGE_PEOPLE_FAILURE,  payload: e});
  }
}

function peopleMerger(payload){
  return api.post(PERSON_MERGE_PATH, {
    body: { people: payload },
  });
}
