import { IsString, IsEnum, IsBoolean, Min, Max, ArrayMinSize, ArrayMaxSize,
  ArrayNotEmpty, ValidateNested, IsInt, IsOptional, Length, MaxLength } from 'class-validator';
import { Cities, OfferType, Amenities, EnumValues } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { updateValidationMessages } from './update-offer.validation-messages.js';
import { CoordinatesDto } from './create-offer.dto.js';
import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, ROOMS_MIN, ROOMS_MAX, GUESTS_MIN, GUESTS_MAX, COST_MIN, COST_MAX } from './const-validation.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: updateValidationMessages.title.isString })
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, { message: updateValidationMessages.title.length })
    title?: string;

  @IsOptional()
  @IsString({ message: updateValidationMessages.description.isString })
  @Length(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, { message: updateValidationMessages.description.length })
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
  @Min(ROOMS_MIN, { message: updateValidationMessages.rooms.min })
  @Max(ROOMS_MAX, { message: updateValidationMessages.rooms.max })
    rooms?: number;

  @IsOptional()
  @IsInt({ message: updateValidationMessages.guests.isInt })
  @Min(GUESTS_MIN, { message: updateValidationMessages.guests.min })
  @Max(GUESTS_MAX , { message: updateValidationMessages.guests.max })
    guests?: number;

  @IsOptional()
  @IsInt({ message: updateValidationMessages.cost.isInt })
  @Min(COST_MIN, { message: updateValidationMessages.cost.min })
  @Max(COST_MAX, { message: updateValidationMessages.cost.max })
    cost?: number;

  @IsOptional()
  @IsEnum(Amenities, { each: true , message: updateValidationMessages.amenities.isEnum })
    amenities?: EnumValues<typeof Amenities>[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
    coordinates?: CoordinatesDto;
}

export { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH, ROOMS_MIN, ROOMS_MAX, GUESTS_MIN, GUESTS_MAX, COST_MIN, COST_MAX };
