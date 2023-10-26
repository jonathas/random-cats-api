import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cats } from './entities/cats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  public constructor(
    @InjectRepository(Cats)
    private readonly catsRepository: Repository<Cats>,
  ) {}

  public getRandomCat() {
    return this.catsRepository.createQueryBuilder().orderBy('random()').getOne();
  }

  public getAllCats() {
    return this.catsRepository.find();
  }

  public async createCat() {
    const cat = this.catsRepository.create({
      title: 'Cat',
      image_url: 'https://cdn2.thecatapi.com/images/MTYwNjUxNQ.jpg',
    });
    await this.catsRepository.save(cat);
    return cat;
  }
}
