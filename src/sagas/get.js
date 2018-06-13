
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import { GET_FOTO, SEARCH_RESULTS } from '../constants/actions';
import { FOTO_PATH } from '../constants/api';
import useAuth from '../util/useAuth';
import appConfig from '../appConfig';
import selectUsername from '../selectors/username';
import { getImageSource, getThumbLocation } from './search';

export default function* listenForGetFoto() {
  yield takeLatest(GET_FOTO, getFoto);
}

function* getFoto(action) {
  try {
    const username = yield select(selectUsername);
    const result = yield call( fetchFoto, username, action.payload);
    yield put({ type: SEARCH_RESULTS,  payload: [result]});
  } catch(e) {
    console.error(e)
  }
}

function fetchFoto(username, id){
  const fotoPath = FOTO_PATH(username,id);
  if(useAuth()){
    return api.get(fotoPath)
      .then(getImageSource);
  }else{
    return api.get(fotoPath)
      .then((result) => {
        const img_location = `${appConfig.s3Url}/${appConfig.s3Bucket}/${result.img_key}`;
        const img_thumb_location = getThumbLocation(img_location, result.img_key, result.img_thumb_key)
        return {
          ...result,
          img_location,
          img_thumb_location,
        };
      })
  }
}
