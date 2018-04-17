import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from 'redux-saga-first-router';
import { Auth } from 'aws-amplify';

export class Header extends Component {
  render() {
    return (<ul>
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
      </ul>);
  }

  handleSignOut(e){
    e.preventDefault();
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onNavigateHome(e) {
      e.preventDefault();
      dispatch(navigate('HOME', {}));
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
  null,
  mapDispatchToProps
)(Header)
