import { UserType, EnumValues } from './const.js';

export type User = {
    name: string;
    email: string;
    avatarPath?: string;
    userType: EnumValues<typeof UserType>;
};
