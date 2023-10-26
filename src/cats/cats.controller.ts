import { Controller, Get, Post } from '@nestjs/common';
import { ImporterService } from './importer/importer.service';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  public constructor(
    private readonly importerService: ImporterService,
    private readonly catsService: CatsService
  ) {}

  @Get()
  public async getCats() {
    return this.catsService.getAllCats();
  }

  @Get('random')
  public async getRandomCat() {
    return this.catsService.getRandomCat();
  }

  @Post('import')
  public async import() {
    return this.importerService.import();
  }
}
