import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { LOG_IN } from '../constants/actions';
import CenterView from './CenterView';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
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
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
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
        </form>
      </CenterView>
    );
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
  null,
  mapDispatchToProps
)(Login)
