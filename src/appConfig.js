
const config = {
  ServiceEndpoint: process.env.REACT_APP_FOTOPIA_API,
  IdentityPoolId: process.env.REACT_APP_CONFIG_IDENTITY_POOL_ID,
  UserPoolId: process.env.REACT_APP_CONFIG_USER_POOL_ID,
  UserPoolClientId: process.env.REACT_APP_CONFIG_USER_POOL_CLIENT_ID,
  Region: process.env.REACT_APP_CONFIG_AWS_REGION,
  Bucket: process.env.REACT_APP_CONFIG_BUCKET,
};

if(process.env.NODE_ENV !== 'production'){
  // window.LOG_LEVEL = 'DEBUG';
}

export default config
