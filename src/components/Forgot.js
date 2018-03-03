import React from 'react';
import { Link } from 'react-router-dom';

const Forgot = props => {
    return (
        <div>
            <h2>Forgot Password</h2>
            <hr />
            <ul>
                <li>
                    <Link to="/">Login</Link>
                </li>
            </ul>
        </div>
    );
};

export default Forgot;