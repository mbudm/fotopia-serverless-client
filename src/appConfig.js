const localhost = 'http://localhost:3000/';
const dev = {
  getConfig: `${localhost}/foto/config`,
  query: `${localhost}query`,
  s3Url: `http://localhost:5000/`,
  AWSConfig: {
    Region: 'some-place'
  },
  userId: process.env.REACT_APP_USER_ID
};

const prod = {
  getConfig: `${process.env.REACT_APP_FOTOPIA_API}foto/config`,
  query: `${process.env.REACT_APP_FOTOPIA_API}query`,
};

const common = {
  s3Bucket: `fotopia-web-app-prod`,
}

const config = process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_API_CONFIG ?
{ ...prod, ...common } : { ...dev, ...common } ;

export default {
  ...config
};
