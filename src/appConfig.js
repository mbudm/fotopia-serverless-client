const localhost = 'http://localhost:3000/';
const dev = {
  getConfig: `${localhost}/foto/config`,
  query: `${localhost}query`,
  api: localhost,
  s3Url: `http://localhost:5000/`,
  AWSConfig: {
    Region: 'some-place'
  },
  username: process.env.REACT_APP_USERNAME
};

const prod = {
  getConfig: `${process.env.REACT_APP_FOTOPIA_API}foto/config`,
  query: `${process.env.REACT_APP_FOTOPIA_API}query`,
  api: process.env.REACT_APP_FOTOPIA_API,
};

const common = {
  s3Bucket: `fotopia-web-app-prod`,
}

const config = process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_API_CONFIG ?
{ ...prod, ...common } : { ...dev, ...common } ;

export default {
  ...config
};
