import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cats } from './entities/cats.entity';
import { Repository } from 'typeorm';
import { CreateCatInput } from './dto/create-cat.input';
import { S3Service } from '../providers/aws/s3/s3.service';
import { S3BucketResourceConfig, S3BucketsConfig } from '../config/aws/s3.config';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Images } from './entities/images.entity';
import { CatDto } from './dto/cat.dto';

@Injectable()
export class CatsService {
  private readonly bucketConfig: S3BucketResourceConfig;

  public constructor(
    @InjectRepository(Cats)
    private readonly catsRepository: Repository<Cats>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    private readonly s3Service: S3Service,
    private readonly config: ConfigService
  ) {
    this.bucketConfig = {
      name: this.config.get<S3BucketsConfig>('s3').catImagesBucket.name
    };
  }

  public async getRandomCat(): Promise<CatDto> {
    const cat = await this.catsRepository.createQueryBuilder('cats').orderBy('random()').getOne();

    const images = await this.imagesRepository.find({ where: { catId: cat.id } });
    const presignedUrls = images.length
      ? await Promise.all(
          images.map((image) =>
            this.s3Service.getSignedUrl({
              filename: image.filename,
              bucketConfig: this.bucketConfig
            })
          )
        )
      : [];

    return {
      id: cat.id,
      title: cat.title,
      imageUrl: cat.imageUrl,
      images: presignedUrls,
      createdAt: cat.createdAt
    };
  }

  public async getAllCats(): Promise<CatDto[]> {
    const cats = await this.catsRepository
      .createQueryBuilder('cats')
      .leftJoinAndSelect('cats.images', 'images')
      .getMany();

    return this.getFormattedOutput(cats);
  }

  private async getFormattedOutput(cats: Cats[]): Promise<CatDto[]> {
    const catsResponse: CatDto[] = [];

    for (const cat of cats) {
      const res = {
        id: cat.id,
        title: cat.title,
        imageUrl: cat.imageUrl,
        images: [],
        createdAt: cat.createdAt
      };

      if (cat.images.length) {
        res.images = await Promise.all(
          cat.images.map((image) =>
            this.s3Service.getSignedUrl({
              filename: image.filename,
              bucketConfig: this.bucketConfig
            })
          )
        );
      }

      catsResponse.push(res);
    }

    return catsResponse;
  }

  public async createCat(images: Array<Express.Multer.File>, input: CreateCatInput) {
    const catEntity = this.catsRepository.create({
      title: input.title,
      ...(input.imageUrl ? { imageUrl: input.imageUrl } : {})
    });
    const cat = await this.catsRepository.save(catEntity);

    for (const image of images) {
      const ext = image.originalname.split('.').pop();
      const filename = `${randomUUID()}.${ext}`;
      await this.s3Service.uploadFileFromBuffer(this.bucketConfig, image.buffer, filename);
      await this.imagesRepository.save(
        this.imagesRepository.create({
          catId: cat.id,
          filename
        })
      );
    }

    return cat;
  }

  /*public async rateCat() {
    const cat = await this.catsRepository.findOneOrFail({
      order: {
        id: 'DESC',
      },
    });
    cat.rating = Math.floor(Math.random() * 5) + 1;
    await this.catsRepository.save(cat);
    return cat;
  }*/
}
