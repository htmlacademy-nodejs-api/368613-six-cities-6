import { User } from './user.type.js';
import { Cities, OfferType, Amenities, EnumValues } from './const.js';

export type Offer = {
    title: string;
    description: string;
    city: EnumValues<typeof Cities>;
    previewImage: string;
    photos: string[];
    isPremium: boolean;
    type: EnumValues<typeof OfferType>;
    rooms: number;
    guests: number;
    cost: number;
    amenities: EnumValues<typeof Amenities>[];
    author: User;
    coordinates: { latitude: number; longitude: number; };
};
