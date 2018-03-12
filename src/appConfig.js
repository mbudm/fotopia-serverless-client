const localhost = 'http://localhost:3000/';
const dev = {
  getConfig: (process.env.REACT_APP_USE_API_CONFIG ?
    `${process.env.REACT_APP_FOTOPIA_API}foto/config`:
    `${localhost}/foto/config`),
  query: `${localhost}query`,
  userId: process.env.REACT_APP_USER_ID
};

const prod = {
  getConfig: `${process.env.REACT_APP_FOTOPIA_API}foto/config`,
  query: `${process.env.REACT_APP_FOTOPIA_API}query`
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config
};
