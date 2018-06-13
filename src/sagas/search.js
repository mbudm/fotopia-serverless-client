
import { call, put, takeLatest } from 'redux-saga/effects';
import { Storage } from 'aws-amplify';
import * as api from './api';
import { SEARCH, SEARCH_RESULTS } from '../constants/actions';
import { QUERY } from '../constants/api';
import useAuth from '../util/useAuth';
import appConfig from '../appConfig';

export default function* listenForSearch() {
  yield takeLatest(SEARCH, queryFotos);
}

function* queryFotos() {
  try {
    const results = yield call( fetchFotos );
    yield put({ type: SEARCH_RESULTS,  payload: results});
  } catch(e) {
    console.error(e)
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
  }))).then(locations => ({
    ...result,
    img_location: locations[0],
    img_thumb_location: locations[1],
  }));
}

function fetchFotos(){
  const query = {
    criteria: {
      tags: [],
      people: [],
    },
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

