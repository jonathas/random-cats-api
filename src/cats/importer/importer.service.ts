import * as fs from 'fs';
import { readFile } from 'fs/promises';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { Injectable } from '@nestjs/common';
import { Cats } from '../entities/cats.entity';
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
    await this.downloadJSON();

    const data = JSON.parse(await readFile(this.dbPath, 'utf8'));
  
    const cats = data.map((cat) => this.catsRepository.create({
      title: cat.title,
      image_url: cat.image
    }));
    return this.catsRepository.save(cats);
  }

  private async downloadJSON() {
    const url = 'https://hook.eu1.integromat.com/10r7cd1lcwve9j241i98k1f3nn4o3j8g';
  
    Readable.fromWeb((await fetch(url)).body as ReadableStream<any>).pipe(
      fs.createWriteStream(this.dbPath)
    );
  }
}
