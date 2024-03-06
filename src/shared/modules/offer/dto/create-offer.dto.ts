import { IsString, IsEnum, IsBoolean, Min, Max, IsLatitude, IsLongitude, ValidateNested, IsInt, Length, MaxLength, ArrayMaxSize, ArrayMinSize, ArrayNotEmpty } from 'class-validator';
import { Cities, OfferType, Amenities, EnumValues } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { validationMessages } from './create-offer.validation-messages.js';
import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, ROOMS_MIN, ROOMS_MAX, GUESTS_MIN, GUESTS_MAX, COST_MIN, COST_MAX, PREVIEW_IMAGE_MAX_LENGTH, PHOTOS_MAX_LENGTH, PHOTOS_ARRAY_SIZE } from './const-validation.js';

export class CoordinatesDto {
  @IsLatitude({ message: validationMessages.coordinates.latitude.isLatitude })
    latitude: number;

  @IsLongitude({ message: validationMessages.coordinates.longitude.isLongitude })
    longitude: number;
}

export class CreateOfferDto {
  @IsString({ message: validationMessages.title.isString })
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, { message: validationMessages.title.length })
    title: string;

  @IsString({ message: validationMessages.description.isString })
  @Length(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, { message: validationMessages.description.length })
    description: string;

  @IsEnum(Cities, { message: validationMessages.city.isEnum })
    city: EnumValues<typeof Cities>;

  @IsBoolean({ message: validationMessages.isPremium.isBoolean })
    isPremium: boolean;

  @MaxLength(PREVIEW_IMAGE_MAX_LENGTH, { message: validationMessages.previewImage.maxLength })
    previewImage: string;

  @MaxLength(PHOTOS_MAX_LENGTH, { each: true, message: validationMessages.photos.maxLength })
  @ArrayMinSize(PHOTOS_ARRAY_SIZE, { message: validationMessages.photos.arrayMinSize })
  @ArrayMaxSize(PHOTOS_ARRAY_SIZE, { message: validationMessages.photos.arrayMaxSize })
  @ArrayNotEmpty({ message: validationMessages.photos.arrayNotEmpty })
    photos: string[] = new Array(PHOTOS_ARRAY_SIZE).fill('');

    @IsEnum(OfferType, { message: validationMessages.type.isEnum })
      type: EnumValues<typeof OfferType>;

    @IsInt({ message: validationMessages.rooms.isInt })
    @Min(ROOMS_MIN, { message: validationMessages.rooms.min })
    @Max(ROOMS_MAX, { message: validationMessages.rooms.max })
      rooms: number;

    @IsInt({ message: validationMessages.guests.isInt })
    @Min(GUESTS_MIN, { message: validationMessages.guests.min })
    @Max(GUESTS_MAX, { message: validationMessages.guests.max })
      guests: number;

    @IsInt({ message: validationMessages.cost.isInt })
    @Min(COST_MIN, { message: validationMessages.cost.min })
    @Max(COST_MAX, { message: validationMessages.cost.max })
      cost: number;

    @IsEnum(Amenities, { each: true , message: validationMessages.amenities.isEnum })
      amenities: EnumValues<typeof Amenities>[];

    authorId: string;

    @ValidateNested()
    @Type(() => CoordinatesDto)
      coordinates: CoordinatesDto;
}
