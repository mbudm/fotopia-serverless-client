[![Build Status](https://travis-ci.org/mbudm/fotopia-serverless-client.svg?branch=master)](https://travis-ci.org/mbudm/fotopia-serverless-client)
# Fotopia Serverless client

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

It is a client for the [fotopia-serverless](https://github.com/facebookincubator/create-react-app) api

## Local development
### Setup

- `yarn install`
- local or remote instance of `fotopia-serverless` stack

### Usage
Depending on what part of the client you want to work on you may need to run against a serverless offline stack with or without auth or a dev or production stack. The following scripts and env vars let you do this.

- `yarn start` Run using local API with no auth
- `yarn start-auth-local` Run using local API and remote auth
- `yarn start-auth-remote` Run using remote API and remote auth
- `yarn test` unit tests (watch)
- `yarn test-once` unit tests (single run)

### Env vars
Environment vars, added to local `.env` file or set as part of shell cmd.
```sh
PORT=4000 # create-react-app defaults to 3000 which clashes with serverless-offline
REACT_APP_FOTOPIA_API=https://[stack-key-here].execute-api.us-east-1.amazonaws.com/prod/ # point to a deployed fotopia-serverless stack
REACT_APP_USE_API_CONFIG=1 #use the api specified by config
REACT_APP_USE_AUTH=1 #use authentication as specified by config
```

## CI/CD
The `.travis.yml` file does the following steps on commit:

- `sh serverless.env.sh` create env vars for serverless.yml
- `yarn lint`
- `yarn test-once`
- `yarn build`
- `npm install -g serverless`
- `sls deploy -s dev` Deploy to dev stage environment
- `sls deploy -s prod` Deploy to prod stage environment

### Required environmnet vars
```sh
AWS_ACCESS_KEY_ID=<aws access key>
AWS_SECRET_ACCESS_KEY=<aws secret key> 
ACM_CERT_ARN_DEV='get the arn from the cert manager'
ACM_CERT_ARN_PROD='get the arn from the cert manager'
BUCKET_NAME_DEV='my-test-bucket-name'
BUCKET_NAME_PROD='my-bucket-name'
CUSTOM_DOMAIN_DEV='test.my-domain.com' # cloudfront
CUSTOM_DOMAIN_PROD='my-domain.com'  # cloudfront
HOSTED_ZONE_NAME='my-domain.com.' # <- the dot is intentional, a route53 requirement
```

## Todo
- Work out a good functional test that can be run in CI - maybe chrome driver & puppeteer.
