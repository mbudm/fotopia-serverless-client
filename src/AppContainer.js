import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from './App';
import Login from './components/Login';
import useAuth from './util/useAuth'

class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    };
  }
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
    return useAuth() ?
      (<Login/>):
      (<App/>);
  }
}

export default connect(state => {
  return {
    config: state.config
  };
})(AppContainer);
