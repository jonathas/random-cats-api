import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCatInput {
  @IsString()
  public title: string;

  @IsUrl()
  @IsOptional()
  public image_url?: string;
}
