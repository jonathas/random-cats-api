import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cats } from './entities/cats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ratings } from './entities/ratings.entity';
import { Images } from './entities/images.entity';
import { ImporterService } from './importer/importer.service';
import { AWSModule } from '../providers/aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Cats, Images, Ratings]), AWSModule, ConfigModule],
  controllers: [CatsController],
  providers: [CatsService, ImporterService]
})
export class CatsModule {}
