import { registerAs } from '@nestjs/config';
import { Environments } from '../shared/enums';

export interface GeneralConfig {
  logLevel: string;
  environment: Environments;
  httpRetriesCount: number;
  httpRetriesDelay: number;
  apiKey: string;
}

export default registerAs(
  'general',
  (): GeneralConfig => ({
    environment: (process.env.NODE_ENV || 'development') as Environments,
    logLevel: process.env.LOG_LEVEL || 'debug',
    httpRetriesCount: parseInt(process.env.HTTP_RETRIES_COUNT) || 3,
    httpRetriesDelay: parseInt(process.env.HTTP_RETRIES_DELAY) || 1000,
    apiKey: process.env.API_KEY
  })
);
