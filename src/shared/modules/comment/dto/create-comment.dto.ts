import { IsMongoId, IsString, Length, IsInt, Min, Max } from 'class-validator';
import { createCommntsValidationMessages } from './create-comment.validate-messages.js';

const TEXT_MIN_LENGTH = 5;
const TEXT_MAX_LENGTH = 1024;
const RATING_MIN = 1;
const RATING_MAX = 5;

export class CreateCommentDto {
  @IsString({ message: createCommntsValidationMessages.text.isString })
  @Length(TEXT_MIN_LENGTH, TEXT_MAX_LENGTH, { message: createCommntsValidationMessages.text.length })
  public text: string;

  @IsInt({ message: createCommntsValidationMessages.rating.isInt })
  @Min(RATING_MIN, { message: createCommntsValidationMessages.rating.min })
  @Max(RATING_MAX, { message: createCommntsValidationMessages.rating.max })
  public rating: number;

  @IsMongoId({ message: createCommntsValidationMessages.offerId.isMongoId })
  public offerId: string;

  public authorId: string;
}
