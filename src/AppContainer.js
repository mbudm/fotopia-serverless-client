import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from './App';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import selectAuth from './selectors/auth'
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
    return this.props.auth && this.props.auth.setup ?
      this.renderApp() :
      this.renderLoader() ;
  }

  renderLoader() {
    return (<div>
      Loadin'
      </div>);
  }

  renderApp() {
    return componentMap[this.props.signedIn];
  }
}

export default connect(state => {
  return {
    auth: selectAuth(state),
    signedIn: signedInStatus(state)
  };
})(AppContainer);
