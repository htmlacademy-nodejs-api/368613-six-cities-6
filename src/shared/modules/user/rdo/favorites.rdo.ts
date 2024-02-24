import { Expose} from 'class-transformer';
//import { OfferRdo } from '../../offer/index.js';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class FavoritesRdo {
  @Expose()
    id: string;

  @Expose()
    name: string;

    @Transform(({ value }) => value.map((item: Types.ObjectId) => item.toString()))
    @Expose({ name: 'favoriteOffers' })
      favoriteOffers: string[];
}
