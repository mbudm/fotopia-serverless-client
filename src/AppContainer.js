import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from './App';
import { withAuthenticator } from 'aws-amplify-react';

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
    return process.env.NODE_ENV === 'development' ?
      (<App />):
      (<AppAuth />)
  }
}

export default connect(state => {
  return {
    config: state.config
  };
})(AppContainer);
