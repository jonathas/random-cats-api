import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { DatabaseModule } from './providers/sql/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import generalConfig from './config/general.config';
import { HttpModule } from './providers/http/http.module';
import awsConfig from './config/aws/aws.config';
import s3Config from './config/aws/s3.config';
import { AWSModule } from './providers/aws/aws.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [generalConfig, databaseConfig, awsConfig, s3Config],
      cache: true
    }),
    DatabaseModule,
    HttpModule,
    AWSModule,
    AuthModule,
    CatsModule
  ]
})
export class AppModule {}
