import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from './App';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import useAuth from './util/useAuth'
import signedInStatus from './selectors/signedInStatus';
import {
  NEW_PASSWORD_REQUIRED,
  SIGNED_IN,
  SIGNED_OUT
} from './constants/user';

const componentMap = {
  [NEW_PASSWORD_REQUIRED]: <ChangePassword/>,
  [SIGNED_IN]: <App/>,
  [SIGNED_OUT]: <Login/>
}

class AppContainer extends Component {
  render() {
    return this.props.config && this.props.config.received ?
      this.renderApp() :
      this.renderLoader() ;
  }

  renderLoader() {
    return (<div>
      Loadin'
      </div>);
  }

  renderApp() {
    return useAuth()? componentMap[this.props.signedIn] : (<App/>);
  }
}

export default connect(state => {
  return {
    config: state.config,
    signedIn: signedInStatus(state)
  };
})(AppContainer);
