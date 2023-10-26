import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ImporterService } from './importer.service';
import { CatsService } from './cats.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCatInput } from './dto/create-cat.input';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RateCatInput } from './dto/rate-cat.input';

@UseGuards(AuthGuard('api-key'))
@Controller('cats')
export class CatsController {
  public constructor(
    private readonly importerService: ImporterService,
    private readonly catsService: CatsService
  ) {}

  @Get()
  public getCats() {
    return this.catsService.getAllCats();
  }

  @Get('random')
  public getRandomCat() {
    return this.catsService.getRandomCat();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  public createCat(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpg|jpeg)/
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    images: Array<Express.Multer.File>,
    @Body() input: CreateCatInput
  ) {
    return this.catsService.createCat(images, input);
  }

  @Post(':id/ratings')
  public rateCat(@Param('id') id: number, @Body() input: RateCatInput) {
    return this.catsService.rateCat(id, input);
  }

  @Post('import')
  public import() {
    return this.importerService.import();
  }
}
