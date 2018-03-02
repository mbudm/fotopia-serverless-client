import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import appConfig from './config';

class App extends Component {
  state = {
    apiConfig: {}
  };

  componentDidMount() {
    this.getConfig();
  }

  getConfig() {
    return fetch(`http://localhost:3000/foto/config`, {
      accept: 'application/json'
    })
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        this.setState({
          apiConfig: data
        });
      });
  }
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }

  parseJSON(response) {
    return response.json();
  }

  render() {
    return (
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

          <Route
            exact
            path="/"
            render={props => (
              <Login region={this.state.apiConfig.Region} clientId={this.state.apiConfig.UserPoolClientId} />
            )}
          />
          <Route path="/upload" component={Upload} />
          <Route path="/view" component={View} />
        </div>
      </Router>
    );
  }
}

const Login = props => {
  console.log('render', props);
  // https://aws.github.io/aws-amplify/media/quick_start.html
  return (
    <div>
      <h2>Login</h2>
      <pre>
        {appConfig.getIss(props.region, props.clientId)}
      </pre>
    </div>
  );
};

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
