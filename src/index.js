import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { saga as routerSaga, buildRoutesMap, route } from 'redux-saga-first-router';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory'

import './index.css';
import AppContainer from './AppContainer';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import sagas from './sagas';
import {
  HOME,
  UPLOAD,
  EDIT
} from './constants/routes';

import * as navigateSagas from './sagas/navigate';

const routesMap = buildRoutesMap(
  route(EDIT, '/edit', navigateSagas.editNavigate),
  route(UPLOAD, '/upload', navigateSagas.uploadNavigate),
  route(HOME, '/', navigateSagas.homeNavigate),
);

const sagaMiddleware = createSagaMiddleware();
const history = createHistory()
// eslint-disable-next-line
let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
  const composeWithDevToolsExtension =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (typeof composeWithDevToolsExtension === 'function') {
    composeEnhancers = composeWithDevToolsExtension;
  }
}

const combinedMiddleware = composeEnhancers(applyMiddleware(sagaMiddleware));

const store = createStore(
  reducers,
  combinedMiddleware
);

sagaMiddleware.run(sagas);
sagaMiddleware.run(routerSaga, routesMap, history);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
