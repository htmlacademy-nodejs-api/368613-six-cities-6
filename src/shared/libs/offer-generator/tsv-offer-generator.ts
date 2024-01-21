import dayjs from 'dayjs';
import { Cities, OfferType, Amenities, BooleanString, UserType } from '../../types/const.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_COST = 100;
const MAX_COST = 100000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 50;

export class TSVOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const previewImage = getRandomItem(this.mockData.photos);
    const photos = getRandomItems(this.mockData.photos).join(',');
    const city = getRandomItem(Object.keys(Cities));
    const type = getRandomItem(Object.keys(OfferType));
    const amenities = getRandomItems(Object.keys(Amenities)).join(',');

    const postDate = dayjs().subtract(generateRandomValue(1, 30), 'day').format('YYYY-MM-DD');
    const isPremium = Math.random() < 0.5 ? BooleanString.TRUE : BooleanString.FALSE;
    const isFavorite = Math.random() < 0.5 ? BooleanString.TRUE : BooleanString.FALSE;
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const cost = generateRandomValue(MIN_COST, MAX_COST).toString();
    const commentsCount = generateRandomValue(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT).toString();

    // Генерация данных автора
    const userName = getRandomItem(this.mockData.userNames);
    const userEmail = getRandomItem(this.mockData.userEmails);
    const userAvatar = getRandomItem(this.mockData.avatars);
    const userType = Math.random() < 0.5 ? UserType.Regular : UserType.Pro;

    // Генерация координат
    const latitude = generateRandomValue(-90, 90, 5).toString();
    const longitude = generateRandomValue(-180, 180, 5).toString();
    const coordinates = `${latitude},${longitude}`;

    return [
      title, description, postDate, city, previewImage, photos,
      isPremium, isFavorite, rating, type, rooms,
      guests, cost, amenities, userName, userEmail,
      userAvatar, userType, commentsCount, coordinates
    ].join('\t');
  }
}
