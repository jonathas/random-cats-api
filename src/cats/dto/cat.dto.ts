export class CatDto {
  public id: number;

  public title: string;

  public imageUrl?: string;

  public rating?: number;

  public ratingSum?: number;

  public ratingCount?: number;

  public images?: string[];

  public createdAt: Date;
}
