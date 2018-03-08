const dev = {
  getConfig: `http://localhost:3000/foto/config`
};

const prod = {
  getConfig: `${process.env.REACT_APP_FOTOPIA_API}/foto/config`
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config
};
