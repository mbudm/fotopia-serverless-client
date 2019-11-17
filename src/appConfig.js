const localhost = 'http://localhost:3000/';
const dev = {
  api: localhost,
  s3Url: `http://localhost:5000`,
  s3Bucket: process.env.REACT_APP_S3_BUCKET || `fotopia-web-app-none-dev`,
  AWSConfig: {
    Region: 'some-place'
  },
  username: process.env.REACT_APP_USERNAME
};

const prod = {
  api: process.env.REACT_APP_FOTOPIA_API,
};

const common = {}

const config = process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_API_CONFIG ?
{ ...prod, ...common } : { ...dev, ...common } ;

if(process.env.NODE_ENV !== 'production'){
  // window.LOG_LEVEL = 'DEBUG';
}

export default {
  ...config
};
