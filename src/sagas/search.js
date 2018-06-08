
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

function getImageSource(result){
  return Storage.get(result.img_key, {
    level: 'protected',
    identityId: result.userIdentityId
  })
    .then((img_location) => ({
      ...result,
      img_location
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
      return results.map((result) => ({
        ...result,
        img_location: `${appConfig.s3Url}/${appConfig.s3Bucket}/${result.img_key}`
      }));
    });
  }
}

