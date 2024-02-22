import { EnumValues, Cities, OfferType, Amenities } from '../../../types/index.js';
import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
    id: string;

  @Expose()
    title: string;

  @Expose()
    description: string;

  @Expose()
    postDate: Date;

  @Expose()
    city: EnumValues<typeof Cities>;

  @Expose()
    previewImage: string;

  @Expose()
    photos: string[];

  @Expose()
    isPremium: boolean;

  @Expose()
    isFavorite: boolean;

  @Expose()
    rating: number;

  @Expose()
    type: EnumValues<typeof OfferType>;

  @Expose()
    rooms: number;

  @Expose()
    guests: number;

  @Expose()
    cost: number;

  @Expose()
    amenities: EnumValues<typeof Amenities>[];

  @Expose({ name: 'authorId'})
    @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
    commentsCount: number;

  @Expose()
    coordinates: { latitude: number; longitude: number; };
}
