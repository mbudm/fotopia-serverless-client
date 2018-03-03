import React from 'react';
import { Link } from 'react-router-dom';

const Login = props => {
  return (
    <div>
      <h2>Login</h2>
      <hr />
      <ul>
        <li>
          <Link to="/forgot">Forgot Password</Link>
        </li>
      </ul>
    </div>
  );
};

export default Login;
