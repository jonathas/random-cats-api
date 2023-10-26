import { IsNumber, Max, Min } from 'class-validator';

export class RateCatInput {
  @Min(1)
  @Max(5)
  @IsNumber()
  public rating: number;
}
