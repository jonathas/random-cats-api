export class Cat {
  public id: string;

  public date: Date;

  public image: string;

  public title: string;

  public rating: number;

  public ratingSum: number;

  public ratingCount: number;
}

export interface RateCatPayload extends Cat {
  rating: number;
}
