
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from 'redux-saga-first-router';
import {
  DELETE_FOTO,
  DELETE_FOTO_FAILURE,
  DELETE_FOTO_SUCCESS,
  SEARCH
} from '../constants/actions';
import { HOME } from '../constants/routes';
import appConfig from '../appConfig';
import useAuth from '../util/useAuth';
import * as api from './api';
import { getUserInfo } from './upload';
import { FOTO_PATH } from '../constants/api';
import selectFilters from '../selectors/filters';

export default function* listenForDeleteFoto() {
  yield takeLatest(DELETE_FOTO, deleteFoto);
}

function* deleteFoto(action) {

  let info;
  if(useAuth()){
    info = yield select(getUserInfo);
  }else{
    info = {
      username: appConfig.username,
      id: appConfig.username //something in place of cognito user id
    }
  }

  const fotoPath = FOTO_PATH(info.username, action.payload);
  const deletedImageResponse = yield call( api.del, fotoPath );
  if(deletedImageResponse){
    yield put({type: DELETE_FOTO_SUCCESS, payload: action.payload});
    const filters = yield select(selectFilters);
    yield put({type: SEARCH, payload: {...filters}});
    yield put(navigate(HOME));
  }else{
    yield put({type: DELETE_FOTO_FAILURE, payload: action.payload});
  }

}
