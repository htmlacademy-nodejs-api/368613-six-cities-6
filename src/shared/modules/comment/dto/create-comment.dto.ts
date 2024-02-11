export class CreateCommentDto {
  public text: string;
  public rating: number;
  postDate: Date;
  public offerId: string;
  public authorId: string;
}
