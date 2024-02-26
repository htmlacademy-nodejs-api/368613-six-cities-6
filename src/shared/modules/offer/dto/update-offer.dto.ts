import { IsString, IsEnum, IsBoolean, Min, Max, ArrayMinSize, ArrayMaxSize,
  ArrayNotEmpty, ValidateNested, IsInt, IsOptional, Length, MaxLength } from 'class-validator';
import { Cities, OfferType, Amenities, EnumValues } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { updateValidationMessages } from './update-offer.validation-messages.js';
import { CoordinatesDto } from './create-offer.dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: updateValidationMessages.title.isString })
  @Length(10, 100, { message: updateValidationMessages.title.length })
    title?: string;

  @IsOptional()
  @IsString({ message: updateValidationMessages.description.isString })
  @Length(20, 1024, { message: updateValidationMessages.description.length })
    description?: string;

  @IsOptional()
  @IsEnum(Cities, { message: updateValidationMessages.city.isEnum })
    city?: EnumValues<typeof Cities>;

  @IsOptional()
  @MaxLength(256, { message: updateValidationMessages.previewImage.maxLength })
    previewImage?: string;

  @IsOptional()
  @MaxLength(256, { each: true, message: updateValidationMessages.photos.maxLength })
  @ArrayMinSize(1, { message: updateValidationMessages.photos.arrayMinSize })
  @ArrayMaxSize(6, { message: updateValidationMessages.photos.arrayMaxSize })
  @ArrayNotEmpty({ message: updateValidationMessages.photos.arrayNotEmpty })
    photos?: string[];

  @IsOptional()
  @IsBoolean({ message: updateValidationMessages.isPremium.isBoolean })
    isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType, { message: updateValidationMessages.type.isEnum })
    type?: EnumValues<typeof OfferType>;

  @IsOptional()
  @IsInt({ message: updateValidationMessages.rooms.isInt })
  @Min(1, { message: updateValidationMessages.rooms.min })
  @Max(8, { message: updateValidationMessages.rooms.max })
    rooms?: number;

  @IsOptional()
  @IsInt({ message: updateValidationMessages.guests.isInt })
  @Min(1, { message: updateValidationMessages.guests.min })
  @Max(10 , { message: updateValidationMessages.guests.max })
    guests?: number;

  @IsOptional()
  @IsInt({ message: updateValidationMessages.cost.isInt })
  @Min(100, { message: updateValidationMessages.cost.min })
  @Max(100000, { message: updateValidationMessages.cost.max })
    cost?: number;

  @IsOptional()
  @IsEnum(Amenities, { each: true , message: updateValidationMessages.amenities.isEnum })
    amenities?: EnumValues<typeof Amenities>[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
    coordinates?: CoordinatesDto;
}
