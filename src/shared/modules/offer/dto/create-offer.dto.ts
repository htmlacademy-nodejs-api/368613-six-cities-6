import { IsString, IsEnum, IsUrl, IsBoolean, Min, Max, ArrayMinSize, ArrayMaxSize,
  ArrayNotEmpty, IsLatitude, IsLongitude, ValidateNested, IsInt, IsMongoId, Length } from 'class-validator';
import { Cities, OfferType, Amenities, EnumValues } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { validationMessages } from './create-offer.validation-masseges.js';

export class CoordinatesDto {
  @IsLatitude({ message: validationMessages.coordinates.latitude.isLatitude })
    latitude: number;

  @IsLongitude({ message: validationMessages.coordinates.longitude.isLongitude })
    longitude: number;
}

export class CreateOfferDto {
  @IsString({ message: validationMessages.title.isString })
  @Length(10, 100, { message: validationMessages.title.length })
    title: string;

  @IsString({ message: validationMessages.description.isString })
  @Length(20, 1024, { message: validationMessages.description.length })
    description: string;

  @IsEnum(Cities, { message: validationMessages.city.isEnum })
    city: EnumValues<typeof Cities>;

  @IsUrl({}, { message: validationMessages.previewImage.isUrl })
    previewImage: string;

  @IsString({ each: true, message: validationMessages.photos.isString })
  @ArrayMinSize(1, { message: validationMessages.photos.arrayMinSize })
  @ArrayMaxSize(6, { message: validationMessages.photos.arrayMaxSize })
  @ArrayNotEmpty({ message: validationMessages.photos.arrayNotEmpty })
    photos: string[];

  @IsBoolean({ message: validationMessages.isPremium.isBoolean })
    isPremium: boolean;

  @IsEnum(OfferType, { message: validationMessages.type.isEnum })
    type: EnumValues<typeof OfferType>;

  @IsInt({ message: validationMessages.rooms.isInt })
  @Min(1, { message: validationMessages.rooms.min })
  @Max(8, { message: validationMessages.rooms.max })
    rooms: number;

  @IsInt({ message: validationMessages.guests.isInt })
  @Min(1, { message: validationMessages.guests.min })
  @Max(10 , { message: validationMessages.guests.max })
    guests: number;

  @IsInt({ message: validationMessages.cost.isInt })
  @Min(100, { message: validationMessages.cost.min })
  @Max(100000, { message: validationMessages.cost.max })
    cost: number;

  @IsEnum(Amenities, { each: true , message: validationMessages.amenities.isEnum })
    amenities: EnumValues<typeof Amenities>[];

  @IsMongoId({ message: validationMessages.authorId.isMongoId })
    authorId: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
    coordinates: CoordinatesDto;
}
