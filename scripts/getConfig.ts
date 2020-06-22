import { config } from "dotenv";

import * as fs from 'fs';
import * as colors from 'colors/safe';
import { CloudFormation } from "aws-sdk";
import { argv } from "yargs";
import * as envfile from 'envfile';

config();

const region = argv['region'] as string || process.env.FOTOPIA_AWS_REGION;
const stackname = argv['stackname'] as string || process.env.FOTOPIA_STACK_NAME;

function getCloudFormationConfig() {
  const cf = new CloudFormation({region});
  const params = {
    StackName: stackname,
  };
  return cf.describeStacks(params).promise()
  .then((response: CloudFormation.DescribeStacksOutput) => {
    const outputsList = response.Stacks && response.Stacks[0].Outputs || [];
    return outputsList.reduce((accum: any, output: CloudFormation.Output) => {
      return output.OutputKey ?
        {
          ...accum,
          [output.OutputKey]: output.OutputValue,
        } :
        accum;
      }, {});
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.log(err);
  });
}

function updateEnvWithCfConfig(cfConfig?:any) {
  if(cfConfig && cfConfig.IdentityPoolId && cfConfig.Region){
    const updatedEnv = envfile.stringify({
      ...process.env,
      REACT_CONFIG_IDENTITY_POOL_ID: cfConfig.IdentityPoolId,
      REACT_CONFIG_USER_POOL_ID: cfConfig.UserPoolId,
      REACT_CONFIG_USER_POOL_CLIENT_ID: cfConfig.UserPoolClientId,
      REACT_CONFIG_BUCKET: cfConfig.Bucket,
      REACT_CONFIG_AWS_REGION: cfConfig.Region
    })
    return new Promise((resolve, reject) => {
      fs.writeFile('../.env', updatedEnv, (err) => {
        if(err){
          reject(err);
        }
        resolve();
      })
    })
  } else {
    const configStr = cfConfig ? JSON.stringify(cfConfig) : "undefined";
    throw new Error(`Missing config: ${configStr}`);
  }
}

getCloudFormationConfig()
.then(updateEnvWithCfConfig)
.then(() => console.log(colors.green(`.env updated with config from stack: ${stackname}`)))
.catch((e) => {
  console.log(colors.red('Oh no, we errored somewhere'), e);
  process.exit(1);
})
