import { UserType, EnumValues } from '../../../types/index.js';

export class CreateUserDto {
  name: string;
  email: string;
  avatarPath?: string;
  password: string;
  userType: EnumValues<typeof UserType>;
}
