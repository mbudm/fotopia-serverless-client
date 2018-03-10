import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory'

import './index.css';
import AppContainer from './AppContainer';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const history = createHistory()
const historyMiddleware = routerMiddleware(history)
// eslint-disable-next-line
let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
  const composeWithDevToolsExtension =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (typeof composeWithDevToolsExtension === 'function') {
    composeEnhancers = composeWithDevToolsExtension;
  }
}

const combinedMiddleware = composeEnhancers(applyMiddleware(sagaMiddleware, historyMiddleware));

const store = createStore(
  reducers,
  combinedMiddleware
);

sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer history={history}/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
