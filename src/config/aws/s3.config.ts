import { registerAs } from '@nestjs/config';

export interface S3BucketResourceConfig {
  name: string;
  region?: string;
}

export interface S3BucketsConfig {
  catImagesBucket: S3BucketResourceConfig;
}

export default registerAs(
  's3',
  (): S3BucketsConfig => ({
    catImagesBucket: {
      name: process.env.AWS_S3_CAT_IMAGES_BUCKET_NAME || 'cat-images-dev'
    }
  })
);
