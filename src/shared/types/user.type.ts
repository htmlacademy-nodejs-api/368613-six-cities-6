import { UserType } from './const.js';

export type User = {
    //id: string; // Уникальный идентификатор пользователя
    name: string; // Мин. 1 символ, макс. 15 символов
    email: string; // Валидный адрес электронной почты
    avatarPath?: string; // URL аватара (необязательно)
    //password: string; // Мин. 6 символов, макс. 12 символов
    userType: keyof typeof UserType; // Тип пользователя
};
