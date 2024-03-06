import { UserType, EnumValues } from '../../../types/index.js';
import { IsEmail, IsString, Length, IsEnum } from 'class-validator';
import { userValidationMessages } from './create-user.validation-messages.js';

const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 12;

export class CreateUserDto {
  @IsString({ message: userValidationMessages.name.isString })
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH, { message: userValidationMessages.name.length })
    name: string;

  @IsEmail({}, { message: userValidationMessages.email.isEmail })
    email: string;

  @IsString({ message: userValidationMessages.password.isString })
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, { message: userValidationMessages.password.length })
    password: string;

  @IsEnum(UserType, { message: userValidationMessages.userType.isEnum })
    userType: EnumValues<typeof UserType>;
}
