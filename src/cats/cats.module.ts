import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cats } from './entities/cats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ratings } from './entities/ratings.entity';
import { Images } from './entities/images.entity';
import { ImporterService } from './importer/importer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cats, Images, Ratings])],
  controllers: [CatsController],
  providers: [CatsService, ImporterService]
})
export class CatsModule {}
