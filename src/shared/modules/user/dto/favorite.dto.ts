import { IsMongoId} from 'class-validator';
import { favoriteValidationMessages } from './favorite.validation-messages.js';

export class FavoritesDto {
  userId: string;

  @IsMongoId({ message: favoriteValidationMessages.offerId.isMongoId })
    offerId: string;
}
