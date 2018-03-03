import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import registerServiceWorker from './registerServiceWorker';
import Amplify from 'aws-amplify';

function getConfig() {
  return fetch(`http://localhost:3000/foto/config`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      // cant pass local endpint thru amplify so use lower level libs instead:
      // https://github.com/aws/aws-amplify/blob/master/packages/amazon-cognito-identity-js/src/Client.js#L10
      Amplify.configure({
        Auth: {
          identityPoolId: data.IdentityPoolId,
          region: data.Region,
          userPoolId: data.UserPoolId,
          userPoolWebClientId: data.UserPoolClientId
        }
      });
      ReactDOM.render(<App />, document.getElementById('root'));
    });
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}
getConfig();
registerServiceWorker();
