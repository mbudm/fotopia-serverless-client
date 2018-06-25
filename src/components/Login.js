import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button, FormGroup, FormControl, ControlLabel, Alert } from "react-bootstrap";
import { LOG_IN } from '../constants/actions';
import CenterView from './CenterView';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.onLogin({...this.state});
  }
  render() {
    return (
      <CenterView>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
          {this.props.loginError && <Alert bsStyle="warning">
            {`${this.props.loginError.code}: ${this.props.loginError.message}`}
          </Alert>}
        </form>
      </CenterView>
    );
  }
}

const mapStateToProps = state => {
  return {
    loginError: state.user.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin(payload) {
      dispatch({
        type: LOG_IN,
        payload
      });
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
