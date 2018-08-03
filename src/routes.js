import { saga as routerSaga, buildRoutesMap, route } from 'redux-saga-first-router';
import createHistory from 'history/createBrowserHistory';

import {
  HOME,
  UPLOAD,
  DETAIL,
  EDIT,
} from './constants/routes';
import * as navigateSagas from './sagas/navigate';

export default function setUpRoutes(sagaMiddleware){
  const history = createHistory()

  const routesMap = buildRoutesMap(
    route(EDIT, '/edit', navigateSagas.editNavigate),
    route(UPLOAD, '/upload', navigateSagas.uploadNavigate),
    route(DETAIL, '/detail/:fotoid', navigateSagas.detailNavigate),
    route(HOME, '/', navigateSagas.homeNavigate),
  );

  sagaMiddleware.run(routerSaga, routesMap, history);

}
