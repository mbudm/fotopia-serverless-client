const dev = {
  getIss: (region, clientId) => `http://localhost:3000/foto/iss`
};

const prod = {
  getIss: (region, clientId) =>
    `https://cognito-idp.${region}.amazonaws.com/${clientId}/`
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config
};
