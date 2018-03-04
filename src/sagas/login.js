import {Config, CognitoIdentityCredentials} from "aws-sdk";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
  LOG_IN,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE
} from '../constants/actions';


export default function* listenForLogin() {
  yield takeLatest(LOG_IN, login);
}

function* login(action) {
  try {
    const config = yield select(configSelector);
    const payload = yield call(authSignIn, config, action.payload);
    yield put({
      type: LOG_IN_SUCCESS,
      payload
    });
  } catch (e) {
    yield put({
      type: LOG_IN_FAILURE,
      error: e
    });
  }
}
function authSignIn(appConfig, creds) {

  const authenticationData = {
    Username : creds.username,
    Password : creds.password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userPool = new CognitoUserPool({
    UserPoolId: appConfig.UserPoolId,
    ClientId: appConfig.UserPoolClientId,
  });

  const userData = {
    Username : creds.username,
    Pool : userPool
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log('access token + ' + result.getAccessToken().getJwtToken());

          //POTENTIAL: Region needs to be set if not already set previously elsewhere.
          Config.region = appConfig.Region;

          Config.credentials = new CognitoIdentityCredentials({
            IdentityPoolId: appConfig.IdentityPoolId,
            Logins : {
                // Change the key below according to the specific region your user pool is in.
                [`cognito-idp.${appConfig.Region}.amazonaws.com/${appConfig.UserPoolId}`] : result.getIdToken().getJwtToken()
            }
          });

          //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
          Config.credentials.refresh((error) => {
              if (error) {
                   console.error(error);
              } else {
                   // Instantiate aws sdk service objects now that the credentials have been updated.
                   // example: var s3 = new AWS.S3();
                   console.log('Successfully logged!');
                   resolve(result);
              }
          });
      },

      onFailure: function(err) {
          reject(err);
      },

    });
  });
}

export const configSelector = state => state.config;
