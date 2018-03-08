import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from './App';
import { withAuthenticator } from 'aws-amplify-react';
import useAuth from './util/useAuth'

const AppAuth = withAuthenticator(App);

class AppContainer extends Component {
  render() {
    return this.props.config.received ?
      this.renderApp() :
      this.renderLoader() ;
  }

  renderLoader() {
    return (<div>
      Loadin'
      </div>);
  }

  renderApp() {
    return useAuth() ?
      (<AppAuth />):
      (<App />);
  }
}

export default connect(state => {
  return {
    config: state.config
  };
})(AppContainer);
