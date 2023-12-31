import * as fs from 'fs';
import { writeFile, readFile } from 'fs/promises';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { Injectable } from '@nestjs/common';
import { Cats } from './entities/cats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImporterService {
  private readonly dbPath = `${__dirname}/db.json`;

  public constructor(
    @InjectRepository(Cats)
    private readonly catsRepository: Repository<Cats>
  ) {}

  public async import() {
    const json = await this.fetchJSON();

    const cats = json.map((cat) =>
      this.catsRepository.create({
        title: cat.title,
        imageUrl: cat.image
      })
    );
    return this.catsRepository.save(cats);
  }

  private async fetchJSON() {
    const url = 'https://hook.eu1.integromat.com/10r7cd1lcwve9j241i98k1f3nn4o3j8g';
    const data = await fetch(url);
    return data.json();
  }
}
