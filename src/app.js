import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigate } from 'redux-saga-first-router';

import { Auth } from 'aws-amplify';

import Search from './components/Search';
import Upload from './components/Upload';
import Create from './components/Create';
import Edit from './components/Edit';

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <a href="/" onClick={this.props.onNavigateHome}>Home</a>
          </li>
          <li>
            <a href="/upload" onClick={this.props.onNavigateUpload}>Upload</a>
          </li>
          <li>
            <a href="/edit" onClick={this.props.onNavigateEdit}>Manage</a>
          </li>
          <li>
            <a href="/" onClick={this.handleSignOut}>Sign Out</a>
          </li>
        </ul>
        <hr />
        {this.renderRoute()}
      </div>
    );
  }

  renderRoute(){
    const {routing: {id}} = this.props;
    const routes = {
      UPLOAD: () => <Upload />,
      CREATE: () => <Create />,
      EDIT: () => <Edit />,
    }
    return routes[id] ? routes[id]() : (<Search />);
  }

  handleSignOut(e){
    e.preventDefault();
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
}

const mapStateToProps = state => {
  return {
    routing: state.router
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onNavigateHome(e) {
      e.preventDefault();
      dispatch(navigate('', {}));
    },
    onNavigateUpload(e) {
      e.preventDefault();
      dispatch(navigate('UPLOAD', {}, { replace: true }));
    },
    onNavigateEdit(e) {
      e.preventDefault();
      dispatch(navigate('EDIT', {}, { replace: true }));
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
