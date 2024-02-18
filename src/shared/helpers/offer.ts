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
    //isFavorite,
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
  const amenitiesValues = amenities.split(',').map((amenityKey) => {
    const key = amenityKey.trim() as keyof typeof Amenities;
    return Amenities[key]; // Получаем значение из Amenities по ключу во время выполнения
  });

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: Cities[city as keyof typeof Cities],
    previewImage,
    photos: photos.split(','),
    isPremium: isPremium === BooleanString.TRUE,
    //isFavorite: isFavorite === BooleanString.TRUE,
    rating: Number.parseFloat(rating),
    type: OfferType[type as keyof typeof OfferType],
    amenities: amenitiesValues,
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    cost: Number.parseInt(cost, 10),
    author: { name, email, avatarPath, userType },
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: { latitude, longitude }
  };
}
