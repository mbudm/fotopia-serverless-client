import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Login</Link>
        </li>
        <li>
          <Link to="/upload">Upload</Link>
        </li>
        <li>
          <Link to="/view">View</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Login} />
      <Route path="/upload" component={Upload} />
      <Route path="/view" component={View} />
    </div>
  </Router>
);

const Login = () => (
  <div>
    <h2>Login</h2>
  </div>
);

const Upload = () => (
  <div>
    <h2>Upload</h2>
  </div>
);

const View = ({ match }) => (
  <div>
    <h2>Views</h2>
    <ul>
      <li>
        <Link to={`${match.url}/latest`}>Latest photos</Link>
      </li>
      <li>
        <Link to={`${match.url}/tags`}>Tags</Link>
      </li>
      <li>
        <Link to={`${match.url}/people`}>People</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:viewId`} component={ViewItem} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a view.</h3>}
    />
  </div>
);

const ViewItem = ({ match }) => (
  <div>
    <h3>{match.params.viewId}</h3>
  </div>
);

export default App;