import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { DatabaseModule } from './providers/sql/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import generalConfig from './config/general.config';
import { HttpModule } from './providers/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [generalConfig, databaseConfig],
      cache: true
    }),
    DatabaseModule,
    HttpModule,
    CatsModule
  ]
})
export class AppModule { }
