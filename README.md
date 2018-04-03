# Fotopia Serverless client

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

It is a client for the [fotopia-serverless](https://github.com/facebookincubator/create-react-app) api

## Setup

- `yarn install`
- local or remote instance of `fotopia-serverless stack`

## Usage

- `yarn start`
- `yarn start-auth-local` 
- `yarn start-auth-remote`

## Env vars
Environment vars, added to local `.env` file

```
PORT=4000 # create-react-app defaults to 3000 which classhes with serverless-offline
REACT_APP_FOTOPIA_API=https://[stack-key-here].execute-api.us-east-1.amazonaws.com/prod/ # point to a deployed fotopia-serverless stack
```

