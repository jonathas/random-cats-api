import { S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../../config/aws/aws.config';
import { GeneralConfig } from '../../config/general.config';
import { Environments } from '../../shared/enums';

@Injectable()
export class AWSService {
  protected readonly region: string;

  protected readonly localstackEndpoint: string;

  protected readonly localstackAccessKeyId: string;

  protected readonly localstackSecretAccessKey: string;

  protected readonly currentEnv: Environments;

  public constructor(private configService: ConfigService) {
    this.region = this.configService.get<AwsConfig>('aws').region;
    this.localstackEndpoint = this.configService.get<AwsConfig>('aws').localstackEndpoint;
    this.currentEnv = this.configService.get<GeneralConfig>('general').environment;
    this.localstackAccessKeyId = this.configService.get<AwsConfig>('aws').localstackAccessKeyId;
    this.localstackSecretAccessKey =
      this.configService.get<AwsConfig>('aws').localstackSecretAccessKey;
  }

  protected injectLocalStackEndpointToConfigForDevAndTest(config: S3ClientConfig) {
    /**
     * @see https://docs.localstack.cloud/tools/local-endpoint-injection/
     */

    if ([Environments.DEVELOPMENT, Environments.TEST].includes(this.currentEnv)) {
      Object.assign(config, {
        endpoint: this.localstackEndpoint,
        /**
         * forcePathStyle needs to be true,
         * otherwise the expected endpoint is in the following format:
         * bucketname.s3.localhost.localstack.cloud:4566 instead of the default one of
         * http://localhost:4566/bucketname
         */
        forcePathStyle: true
      });
    }
  }
}
