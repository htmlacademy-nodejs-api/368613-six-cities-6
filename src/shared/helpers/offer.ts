import { Offer } from '../types/index.js';
import { Cities, OfferType, Amenities, UserType, BooleanString } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    postDate,
    city,
    previewImage,
    photos,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    cost,
    amenities,
    name,
    email,
    avatarPath,
    userTypeString,
    commentsCount,
    coordinates
  ] = offerData.replace('\n', '').split('\t');

  const [latitude, longitude] = coordinates.split(',').map(Number);
  const userType = userTypeString as keyof typeof UserType;
  const amenitiesKeys = amenities.split(',').map((amenity) => amenity.trim() as keyof typeof Amenities);

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: Cities[city as keyof typeof Cities],
    previewImage,
    photos: photos.split(','),
    isPremium: isPremium === BooleanString.TRUE,
    isFavorite: isFavorite === BooleanString.TRUE,
    rating: Number.parseFloat(rating),
    type: OfferType[type as keyof typeof OfferType],
    amenities: amenitiesKeys,
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    cost: Number.parseInt(cost, 10),
    author: { name, email, avatarPath, userType },
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: { latitude, longitude }
  };
}
