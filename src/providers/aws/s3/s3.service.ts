import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3ClientConfig,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { fromTokenFile } from '@aws-sdk/credential-providers';
import { AWSService } from '../aws.service';
import { LoggerService } from '../../logger/logger.service';
import {
  PRESIGNED_S3_URL_EXPIRATION_SECONDS,
  S3BucketResourceConfig
} from '../../../config/aws/s3.config';
import { Environments } from '../../../shared/enums';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
 */
@Injectable()
export class S3Service extends AWSService {
  public constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService
  ) {
    super(config);
    this.logger.setContext(S3Service.name);
  }

  private getS3Client(bucketConfig: S3BucketResourceConfig): S3Client {
    const config = this.getS3Config(bucketConfig);
    return new S3Client(config);
  }

  private getS3Config(bucketConfig: S3BucketResourceConfig): S3ClientConfig {
    /**
     * Using IAM role policy to use AWS resources
     * @see https://bit.ly/3nkYrOn
     */
    if ([Environments.STAGE, Environments.PRODUCTION].includes(this.currentEnv)) {
      return {
        credentials: fromTokenFile({
          clientConfig: { region: bucketConfig.region || this.region }
        })
      };
    }

    const s3ClientConfig: S3ClientConfig = {
      credentials: {
        accessKeyId: this.localstackAccessKeyId,
        secretAccessKey: this.localstackSecretAccessKey
      },
      region: bucketConfig.region || this.region
    };

    this.injectLocalStackEndpointToConfigForDevAndTest(s3ClientConfig);

    return s3ClientConfig;
  }

  public uploadFileFromBuffer(
    bucketConfig: S3BucketResourceConfig,
    buffer: Buffer | Uint8Array,
    newFilename: string
  ): Promise<PutObjectCommandOutput> {
    const s3Client = this.getS3Client(bucketConfig);
    const s3Object: PutObjectCommandInput = {
      Bucket: bucketConfig.name,
      Key: newFilename,
      Body: buffer
    };
    return this.putObject(s3Object, s3Client);
  }

  /**
   * @see https://go.aws/3GMtR8a
   */
  private putObject(
    params: PutObjectCommandInput,
    s3client: S3Client
  ): Promise<PutObjectCommandOutput> {
    return s3client.send(new PutObjectCommand(params));
  }

  /**
   * @see https://go.aws/3nJkFKn
   */
  public getObject(
    bucketConfig: S3BucketResourceConfig,
    key: string
  ): Promise<GetObjectCommandOutput> {
    const s3Client = this.getS3Client(bucketConfig);
    return s3Client.send(new GetObjectCommand({ Bucket: bucketConfig.name, Key: key }));
  }

  /**
   * @see https://go.aws/3I0bjlF
   */
  public async checkIfObjectExists(
    bucketConfig: S3BucketResourceConfig,
    key: string
  ): Promise<boolean> {
    const s3Client = this.getS3Client(bucketConfig);
    try {
      await s3Client.send(new HeadObjectCommand({ Bucket: bucketConfig.name, Key: key }));
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }

      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error occured while calling checkIfObjectExists()` +
          `Bucket name: ${bucketConfig.name}` +
          `Key name: ${key}`
      );
    }
  }

  /**
   * @see https://go.aws/34H3PoY
   */
  public async getSignedUrl(args: {
    filename: string;
    bucketConfig: S3BucketResourceConfig;
    expiresIn?: number;
    downloadFilename?: string;
  }): Promise<string> {
    const expiresIn = args.expiresIn ?? PRESIGNED_S3_URL_EXPIRATION_SECONDS;
    const { filename, bucketConfig, downloadFilename } = args;

    if (!(await this.checkIfObjectExists(bucketConfig, filename))) {
      this.logger.info(`File ${filename} does not exist in bucket ${bucketConfig.name}.`);
      throw new NotFoundException('FILE_NOT_FOUND');
    }
    const s3Client = this.getS3Client(bucketConfig);
    const getObjectCommand: GetObjectCommand = new GetObjectCommand({
      Bucket: bucketConfig.name,
      Key: filename,
      ResponseContentDisposition: `attachment; filename="${downloadFilename || filename}"`
    });
    return getSignedUrl(s3Client, getObjectCommand, { expiresIn });
  }
}
