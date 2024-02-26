import { User } from './user.type.js';
import { Cities, OfferType, Amenities, EnumValues } from './const.js';

export type Offer = {
    title: string; // Мин. 10 символов, макс. 100 символов
    description: string; // Мин. 20 символов, макс. 1024 символа
    city: EnumValues<typeof Cities>; // Город
    previewImage: string;
    photos: string[]; // URL фотографий
    isPremium: boolean;
    type: EnumValues<typeof OfferType>; // Тип предложения
    rooms: number; // Мин. 1, Макс. 8
    guests: number; // Мин. 1, Макс. 10
    cost: number; // Мин. 100, Макс. 100000
    amenities: EnumValues<typeof Amenities>[]; // Список удобств
    author: User; // Ссылка на сущность "Пользователь"
    coordinates: { latitude: number; longitude: number; }; // Координаты
};
