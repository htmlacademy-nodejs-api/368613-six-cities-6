import { EnumValues, Cities, OfferType, Amenities } from '../../../types/index.js';

export class UpdateOfferDto {
  title?: string;
  description?: string;
  city?: EnumValues<typeof Cities>;
  previewImage?: string;
  photos?: string[];
  isPremium?: boolean;
  type?: EnumValues<typeof OfferType>;
  rooms?: number;
  guests?: number;
  cost?: number;
  amenities?: EnumValues<typeof Amenities>[];
  authorId?: string;
  coordinates?: { latitude: number; longitude: number; };
}
