import { UserType, EnumValues } from '../../../types/index.js';
import { IsEmail, IsString, Length, IsEnum } from 'class-validator';
import { userValidationMessages } from './create-user.validation-messages.js';

export class CreateUserDto {
  @IsString({ message: userValidationMessages.name.isString })
  @Length(1, 15, { message: userValidationMessages.name.length })
    name: string;

  @IsEmail({}, { message: userValidationMessages.email.isEmail })
    email: string;

  @IsString({ message: userValidationMessages.password.isString })
  @Length(6, 12, { message: userValidationMessages.password.length })
    password: string;

  @IsEnum(UserType, { message: userValidationMessages.userType.isEnum })
    userType: EnumValues<typeof UserType>;
}
