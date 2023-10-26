import { registerAs } from '@nestjs/config';

export interface AwsConfig {
  region: string;
  localstackEndpoint: string;
  localstackAccessKeyId: string;
  localstackSecretAccessKey: string;
}

export default registerAs(
  'aws',
  (): AwsConfig => ({
    region: process.env.AWS_REGION || 'eu-central-1',
    localstackEndpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566',
    localstackAccessKeyId: process.env.LOCALSTACK_ACCESS_KEY_ID || 'cats',
    localstackSecretAccessKey: process.env.LOCALSTACK_SECRET_ACCESS_KEY || 'cats'
  })
);
