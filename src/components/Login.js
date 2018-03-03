import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { LOG_IN } from '../constants/actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    render() {
        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <label>Username</label>
                        <input type="text" name="username"/>
                    </p>
                    <p>
                        <label>Password</label>
                        <input type="password" name="password"/>
                    </p>
                    <p>
                        <input type="submit" value="Login" />
                    </p>
                </form>
                <hr />
                <ul>
                    <li>
                        <Link to="/forgot">Forgot Password</Link>
                    </li>
                </ul>
            </div>
        );
    }
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onLogin({
            username: this.state.username,
            password: this.state.password
        })
    }
};

export default connect(
    null,
    dispatch => ({
        onLogin(payload) {
            dispatch({ 
                type: LOG_IN, 
                payload 
            })
        }
    })
)(Login);
