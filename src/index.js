import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import './index.css';
import AppContainer from './AppContainer';
import { register as registerServiceWorker } from './registerServiceWorker';
import reducers from './reducers';
import sagas from './sagas';

import setUpRoutes from  './routes';

import {
  SW_UPDATE,
  SW_SUCCESS,
} from './constants/actions';

import './index.css';


const sagaMiddleware = createSagaMiddleware();
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

setUpRoutes(sagaMiddleware);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer/>
  </Provider>,
  document.getElementById('root')
);

const onUpdate = (registration) => {
  store.dispatch({
    type: SW_UPDATE,
    payload: registration,
  });
}

const onSuccess = (registration) => {
  store.dispatch({
    type: SW_SUCCESS,
    payload: registration
  });
}
registerServiceWorker({ onUpdate, onSuccess });
