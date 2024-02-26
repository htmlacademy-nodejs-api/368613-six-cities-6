import { IsMongoId, IsString, Length, IsInt, Min, Max } from 'class-validator';
import { createCommntsValidationMessages } from './create-comment.validate-messages.js';

export class CreateCommentDto {
  @IsString({ message: createCommntsValidationMessages.text.isString })
  @Length(5, 1024, { message: createCommntsValidationMessages.text.length })
  public text: string;

  @IsInt({ message: createCommntsValidationMessages.rating.isInt })
  @Min(1, { message: createCommntsValidationMessages.rating.min })
  @Max(5, { message: createCommntsValidationMessages.rating.max })
  public rating: number;

  @IsMongoId({ message: createCommntsValidationMessages.offerId.isMongoId })
  public offerId: string;

  @IsMongoId({ message: createCommntsValidationMessages.authorId.isMongoId })
  public authorId: string;
}
