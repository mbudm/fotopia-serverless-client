
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Storage from '@aws-amplify/storage';
import * as api from './api';
import appConfig from '../appConfig';
import {
  SEARCH,
  SEARCH_RESULTS,
  SEARCH_FAILURE
} from '../constants/actions';
import {
  MAX_SEARCH_DURATION_MS,
  CLIENT_ID
} from '../constants/search';
import { QUERY } from '../constants/api';
import selectFilters from '../selectors/filters';

export default function* listenForSearch() {
  yield takeLatest(SEARCH, queryFotos);
}

function* queryFotos(action) {
  try {
    let searchFilters = action.payload;
    if(!action.payload){
      searchFilters = yield select(selectFilters);
    }
    const results = yield call(fetchFotos, searchFilters);
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

export function configureStorage(bucket) {
  Storage.configure({
    AWSS3: {
      bucket,
    }
  });
}

export function getThumbLocation(img_location, img_key, img_thumb_key){
 return img_location.replace(img_key, img_thumb_key);
}

export function getImageSource(result){
  let img_location;
  let img_thumb_location;

  return Storage.get(result.img_key, {
      level: 'protected',
      identityId: result.userIdentityId
    })
    .then((location) => {
      img_location = location;
      // switch to thumbs bucket
      configureStorage(appConfig.BucketGenerated);
      return Storage.get(result.img_thumb_key, {
        level: 'protected',
        identityId: result.userIdentityId
      });
    })
    .then((location) => {
      img_thumb_location = location
      // reset Storage to img bucket
      configureStorage(appConfig.Bucket);
      return {
        ...result,
        img_location,
        img_thumb_location,
      }
    });
}

function addLocations(results) {
  return Promise.all(results.items.map(getImageSource))
    .then((updatedItems) => {
      return {
        ...results,
        items: updatedItems,
      }
    })
}

function fetchFotos(payload){
  const criteria = payload.criteria ||
    {
      tags: [],
      people: [],
    };
  const to = payload.to || Date.now();
  const from = payload.from || (to - MAX_SEARCH_DURATION_MS);
  const query = {
    breakDateRestriction: true,
    clientId: CLIENT_ID,
    criteria,
    from,
    to,
  };

  return api.post(QUERY, { body: query })
    .then(addLocations);
}

