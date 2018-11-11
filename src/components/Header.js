import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from 'redux-saga-first-router';
import { Auth } from 'aws-amplify';
import { Navbar, Nav, NavItem } from "react-bootstrap";

import { LOG_OUT } from '../constants/actions';
import {
  HOME,
  UPLOAD,
  PEOPLE,
} from '../constants/routes';
import './header.css';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }
  render(){
    const {menuOpen} = this.state;
    return (
    <div>
      <div
        className="navbar navbar-fixed-bottom"
        onClick={this.onNavToggleClick} ><span className="screen-readers" >Toggle Nav</span>
      </div>
      {menuOpen && <Navbar inverse collapseOnSelect fixedBottom >
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" onClick={this.props.onNavigateHome}>Fotopia</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse >
          <Nav>
            <NavItem eventKey={1} href="/" onClick={this.props.onNavigateHome}>
              Home
            </NavItem>
            <NavItem eventKey={2} href="/upload" onClick={this.props.onNavigateUpload} >
              Upload
            </NavItem>
            <NavItem eventKey={2} href="/people" onClick={this.props.onNavigatePeople} >
              People
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem href="/" onClick={this.props.onLogOut}>
              Sign out
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>}
    </div>);
  }

  handleSignOut(e){
    e.preventDefault();
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  onNavToggleClick = (e) => {
    const { menuOpen } = this.state;
    this.setState({
      menuOpen: !menuOpen
    })
  }

}

const mapDispatchToProps = dispatch => {
  return {
    onLogOut(e) {
      e.preventDefault();
      dispatch({
        type: LOG_OUT
      });
    },
    onNavigateHome(e) {
      e.preventDefault();
      dispatch(navigate(HOME, {}));
    },
    onNavigateUpload(e) {
      e.preventDefault();
      dispatch(navigate(UPLOAD, {}, { replace: true }));
    },
    onNavigatePeople(e) {
      e.preventDefault();
      dispatch(navigate(PEOPLE, {}, { replace: true }));
    },
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Header)
