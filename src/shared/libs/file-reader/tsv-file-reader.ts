import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer } from '../../types/index.js';
import { Cities, OfferType, Amenities, UserType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('|'))
      .map(([title, description, postDate, city, previewImage, photos, isPremium, isFavorite, rating, type, rooms, guests, cost, amenities, name, email, avatarPath, userTypeString, commentsCount, coordinates]) => {
        const [latitude, longitude] = coordinates ? coordinates.split(',').map(Number) : [];
        const userType = userTypeString as keyof typeof UserType;
        const amenitiesKeys = amenities ? amenities.split(',').map(amenity => {
          const key = amenity.trim() as keyof typeof Amenities;
          if (!Amenities[key]) {
            throw new Error(`Unknown amenity: ${amenity}`);
          }
          return key;
        }) : [];
        return {
          title,
          description,
          postDate: new Date(postDate),
          city: Cities[city as keyof typeof Cities],
          previewImage,
          photos: photos ? photos.split(',') : [],
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number.parseFloat(rating),
          type: OfferType[type as keyof typeof OfferType],
          amenities: amenitiesKeys as (keyof typeof Amenities)[],
          rooms: Number.parseInt(rooms, 10),
          guests: Number.parseInt(guests, 10),
          cost: Number.parseInt(cost, 10),
          author: {name, email, avatarPath, userType },
          commentsCount: Number.parseInt(commentsCount, 10),
          coordinates: { latitude, longitude }
        };
      });
  }
}
