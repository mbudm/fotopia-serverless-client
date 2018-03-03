import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './components/Login';
import Forgot from './components/Forgot';
import Search from './components/Search';
import Upload from './components/Upload';
import Edit from './components/Edit';

class App extends Component {
  render() {
    const { user } = this.props;
    return user.isLoggedIn ? this.renderApp() : this.renderLogin();
  }
  renderLogin() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/forgot" component={Forgot} />
        </div>
      </Router>
    );
  }
  renderApp() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
            <li>
              <Link to="/edit">Manage</Link>
            </li>
          </ul>
          <hr />
          <Route exact path="/" component={Search} />
          <Route path="/upload" component={Upload} />
          <Route path="/edit" component={Edit} />
        </div>
      </Router>
    );
  }
}

export default connect(state => {
  return {
    user: getUserState(state)
  };
})(App);

function getUserState(state) {
  return {
    ...state.user,
    isLoggedIn: !!state.user.name
  };
}
