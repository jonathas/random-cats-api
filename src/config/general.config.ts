import { registerAs } from '@nestjs/config';
import { Environments } from '../shared/enums';

export interface GeneralConfig {
  logLevel: string;
  environment: Environments;
  apiKey: string;
}

export default registerAs(
  'general',
  (): GeneralConfig => ({
    environment: (process.env.NODE_ENV || 'development') as Environments,
    logLevel: process.env.LOG_LEVEL || 'debug',
    apiKey: process.env.API_KEY
  })
);
