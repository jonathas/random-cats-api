import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWSService } from './aws.service';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [ConfigModule],
  providers: [AWSService, S3Service],
  exports: [S3Service]
})
export class AWSModule {}
