import { Expose } from 'class-transformer';
import { UserType, EnumValues } from '../../../types/index.js';

export class UserRdo {
  @Expose()
    name: string;

  @Expose()
    email: string;

  @Expose()
    avatarPath?: string;

  @Expose()
    userType: EnumValues<typeof UserType>;

}
