import { Module } from '@nestjs/common';
import { Cats } from '../entities/cats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImporterService } from './importer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cats])],
  providers: [ImporterService]
})
export class ImporterModule {}
