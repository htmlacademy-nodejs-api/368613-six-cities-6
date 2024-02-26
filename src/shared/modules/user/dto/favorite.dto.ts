import { IsMongoId} from 'class-validator';
import { favoriteValidationMessages } from './favorite.validation-messages.js';

export class FavoritesDto {
  @IsMongoId({ message: favoriteValidationMessages.userId.isMongoId })
    userId: string;

  @IsMongoId({ message: favoriteValidationMessages.offerId.isMongoId })
    offerId: string;
}
