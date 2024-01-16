import { User } from './user.type.js';
import { Cities, OfferType, Amenities } from './const.js';

export type Offer = {
    title: string; // Мин. 10 символов, макс. 100 символов
    description: string; // Мин. 20 символов, макс. 1024 символа
    postDate: Date;
    city: keyof typeof Cities; // Город
    previewImage: string;
    photos: string[]; // URL фотографий
    isPremium: boolean;
    isFavorite: boolean;
    rating: number; // От 1 до 5
    type: keyof typeof OfferType; // Тип предложения
    rooms: number; // Мин. 1, Макс. 8
    guests: number; // Мин. 1, Макс. 10
    cost: number; // Мин. 100, Макс. 100000
    amenities: (keyof typeof Amenities)[]; // Список удобств
    author: User; // Ссылка на сущность "Пользователь"
    commentsCount: number; // Количество комментариев
    coordinates: { latitude: number; longitude: number; }; // Координаты
};
