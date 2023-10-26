import { registerAs } from '@nestjs/config';
import { Environments } from '../shared/enums';

export interface DatabaseConfig {
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
  logQueries: boolean;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    database:
      process.env.NODE_ENV === Environments.TEST ? 'test' : process.env.DATABASE_NAME || 'cats',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    logQueries: process.env.DATABASE_LOG_QUERIES === 'true'
  })
);
