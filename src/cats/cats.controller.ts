import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ImporterService } from './importer/importer.service';
import { CatsService } from './cats.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('api-key'))
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

  /*@Post()
  public async createCat() {
    return this.catsService.createCat();
  }

  @Post(':id/ratings')
  public async rateCat() {
    return this.catsService.rateCat();
  }*/

  @Post('import')
  public async import() {
    return this.importerService.import();
  }
}
