import { Injectable } from '@nestjs/common';
import { Ratings } from './entities/ratings.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RatingsService {
  public constructor(
    @InjectRepository(Ratings)
    private readonly ratingsRepository: Repository<Ratings>
  ) {}

  public rateCat(catId: number, rating: number): Promise<Ratings> {
    const ratingEntity = this.ratingsRepository.create({
      catId,
      rating
    });

    return this.ratingsRepository.save(ratingEntity);
  }

  public async getRatingsSumCountAndAverage(
    catId: number
  ): Promise<{ sum: number; count: number; average: number }> {
    const result = await this.ratingsRepository
      .createQueryBuilder('ratings')
      .select([
        'SUM(ratings.rating) as sum',
        'COUNT(ratings.rating) as count',
        'ROUND(AVG(ratings.rating), 2) as average'
      ])
      .where('ratings.catId = :catId', { catId })
      .getRawOne();

    return { sum: result.sum, count: result.count, average: result.average };
  }
}
