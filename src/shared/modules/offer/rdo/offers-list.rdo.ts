import { EnumValues, Cities, OfferType } from '../../../types/index.js';
import { Expose } from 'class-transformer';

export class OffersListRdo {
@Expose()
  id: string;

@Expose()
  title: string;

@Expose()
  cost: number;

@Expose()
  type: EnumValues<typeof OfferType>;

@Expose()
  isFavorite: boolean;

@Expose()
  createdAt: Date;

@Expose()
  city: EnumValues<typeof Cities>;

@Expose()
  previewImage: string;

@Expose()
  isPremium: boolean;

@Expose()
  rating: number;

@Expose()
  commentsCount: number;

}

