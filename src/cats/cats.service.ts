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

@Injectable()
export class CatsService {
  public constructor(
    @InjectRepository(Cats)
    private readonly catsRepository: Repository<Cats>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    private readonly s3Service: S3Service,
    private readonly config: ConfigService
  ) {}

  public getRandomCat() {
    return this.catsRepository.createQueryBuilder().orderBy('random()').getOne();
  }

  public getAllCats() {
    return this.catsRepository.find();
  }

  public async createCat(images:  Array<Express.Multer.File>, input: CreateCatInput) {
    const catEntity = this.catsRepository.create({
      title: input.title, 
      ...(input.image_url ? { image_url: input.image_url } : {})
    });
    const cat = await this.catsRepository.save(catEntity);

    const bucketConfig: S3BucketResourceConfig = {
      name: this.config.get<S3BucketsConfig>('s3').catImagesBucket.name
    };

    for (const image of images) {
      const ext = image.originalname.split('.').pop();
      const filename = `${randomUUID()}.${ext}`;
      await this.s3Service.uploadFileFromBuffer(bucketConfig, image.buffer, filename);
      await this.imagesRepository.save(this.imagesRepository.create({
        catId: cat.id,
        filename
      }));
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
