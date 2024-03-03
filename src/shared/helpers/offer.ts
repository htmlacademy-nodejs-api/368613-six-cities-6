import { Offer } from '../types/index.js';
import { Cities, OfferType, Amenities, UserType, BooleanString } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    city,
    previewImage,
    photos,
    isPremium,
    type,
    rooms,
    guests,
    cost,
    amenities,
    name,
    email,
    avatarPath,
    userTypeString,
    coordinates
  ] = offerData.replace('\n', '').split('\t');

  const [latitude, longitude] = coordinates.split(',').map(Number);
  const userType = userTypeString as keyof typeof UserType;
  const amenitiesValues = amenities.split(',').map((amenityKey) => {
    const key = amenityKey.trim() as keyof typeof Amenities;
    return Amenities[key];
  });

  return {
    title,
    description,
    city: Cities[city as keyof typeof Cities],
    previewImage,
    photos: photos.split(','),
    isPremium: isPremium === BooleanString.TRUE,
    type: OfferType[type as keyof typeof OfferType],
    amenities: amenitiesValues,
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    cost: Number.parseInt(cost, 10),
    author: { name, email, avatarPath, userType },
    coordinates: { latitude, longitude }
  };
}
