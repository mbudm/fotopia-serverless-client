
import { call, put, takeLatest } from 'redux-saga/effects';
import Storage from '@aws-amplify/storage';
import * as api from './api';
import {
  SEARCH,
  SEARCH_RESULTS,
  SEARCH_FAILURE
} from '../constants/actions';
import { QUERY } from '../constants/api';
import useAuth from '../util/useAuth';
import appConfig from '../appConfig';

export default function* listenForSearch() {
  yield takeLatest(SEARCH, queryFotos);
}

function* queryFotos(action) {
  try {
    const results = yield call( fetchFotos, action.payload);
    yield put({ type: SEARCH_RESULTS,  payload: results});
  } catch(e) {
    console.error(e);
    yield put({ type: SEARCH_FAILURE,  payload: {
      params: action.payload,
      error: e && e.response && e.response.data ? JSON.stringify(e.response.data ) : JSON.stringify(e)
    }
  });
  }

}

export function getThumbLocation(img_location, img_key, img_thumb_key){
 return img_location.replace(img_key, img_thumb_key);
}

export function getImageSource(result){
  return Promise.all([
    result.img_key,
    result.img_thumb_key
  ].map((key) => Storage.get(key, {
    level: 'protected',
    identityId: result.userIdentityId
  }))).then((locations) => {
    console.log("locations", locations);
    return {
      ...result,
      img_location: locations[0],
      img_thumb_location: locations[1],
    }
  });
}

function fetchFotos(criteria = {
  tags: [],
  people: [],
}){
  const query = {
    criteria,
    from: '2004-04-04',
    to: Date.now(),
  };

  if(useAuth()){
    return api.post(QUERY, { body: query })
      .then(results => {
        return Array.isArray(results) ? Promise.all(results.map(getImageSource)) : results ;
      });
  }else{
    return api.post(QUERY, { body: query })
    .then((results) => {
      console.log(results);
      return Array.isArray(results) ? results.map((result) => {
        const img_location = `${appConfig.s3Url}/${appConfig.s3Bucket}/${result.img_key}`
        const img_thumb_location = getThumbLocation(img_location, result.img_key, result.img_thumb_key)
        return {
          ...result,
          img_location,
          img_thumb_location,
        }
      }): results;
    });
  }
}

