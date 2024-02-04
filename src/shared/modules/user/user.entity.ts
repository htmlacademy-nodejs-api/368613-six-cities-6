import { defaultClasses, prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { UserType, User, EnumValues} from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: ''})
  public name: string;

  @prop({unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatarPath?: string;

  @prop({ required: true, enum: Object.values(UserType), type: String})
  public userType: EnumValues<typeof UserType>;

  @prop({ required: true, default: '' })
  private password?: string;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.name = userData.name;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}
export const UserModel = getModelForClass(UserEntity);
