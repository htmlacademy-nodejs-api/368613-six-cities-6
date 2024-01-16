import { User } from './user.type.js';

export type Comment = {
    text: string; // Мин. 5 символов, макс. 1024 символа
    postDate: Date;
    rating: number; // От 1 до 5
    author: User; // Ссылка на сущность "Пользователь"
};
