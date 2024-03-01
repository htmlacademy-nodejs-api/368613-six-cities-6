import { UserType, EnumValues } from './const.js';

export type User = {
    name: string; // Мин. 1 символ, макс. 15 символов
    email: string; // Валидный адрес электронной почты
    avatarPath?: string; // URL аватара (необязательно)
    userType: EnumValues<typeof UserType>; // Тип пользователя
};
