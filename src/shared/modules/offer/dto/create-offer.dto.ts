import { EnumValues, Cities, OfferType, Amenities } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  postDate: Date;
  city: EnumValues<typeof Cities>;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  rating: number;
  type: EnumValues<typeof OfferType>;
  rooms: number;
  guests: number;
  cost: number;
  amenities: EnumValues<typeof Amenities>[];
  authorId: string;
  commentsCount: number;
  coordinates: { latitude: number; longitude: number; };
}

