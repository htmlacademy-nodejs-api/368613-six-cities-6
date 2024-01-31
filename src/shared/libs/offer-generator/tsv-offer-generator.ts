import dayjs from 'dayjs';
import { Cities, OfferType, Amenities, BooleanString, UserType } from '../../types/const.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { limitsForMocks } from '../../constants/index.js';
import { injectable } from 'inversify';

@injectable()
export class TSVOfferGenerator {
  private mockData: MockServerData;

  public setMockData(mockData: MockServerData) {
    this.mockData = mockData;
  }

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
    const rating = generateRandomValue(limitsForMocks.MIN_RATING, limitsForMocks.MAX_RATING, 1).toString();
    const rooms = generateRandomValue(limitsForMocks.MIN_ROOMS, limitsForMocks.MAX_ROOMS).toString();
    const guests = generateRandomValue(limitsForMocks.MIN_GUESTS, limitsForMocks.MAX_GUESTS).toString();
    const cost = generateRandomValue(limitsForMocks.MIN_COST, limitsForMocks.MAX_COST).toString();
    const commentsCount = generateRandomValue(limitsForMocks.MIN_COMMENTS_COUNT, limitsForMocks.MAX_COMMENTS_COUNT).toString();

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
