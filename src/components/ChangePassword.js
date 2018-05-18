import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { CHANGE_PASSWORD } from '../constants/actions';
import CenterView from './CenterView';

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordCheck: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.password.length > 0
    && this.state.passwordCheck.length > 0
    && this.state.password === this.state.passwordCheck;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit({...this.state});
  }
  render() {
    return (
      <CenterView>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>New password</ControlLabel>
            <FormControl
              autoFocus
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="passwordCheck" bsSize="large">
            <ControlLabel>Re-enter new password</ControlLabel>
            <FormControl
              value={this.state.passwordCheck}
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
            Change Password
          </Button>
        </form>
      </CenterView>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit(payload) {
      dispatch({
        type: CHANGE_PASSWORD,
        payload
      });
    },
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ChangePassword)
