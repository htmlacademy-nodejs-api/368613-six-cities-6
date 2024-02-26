import { Cities, OfferType, Amenities, BooleanString, UserType, CityCoordinates } from '../../types/const.js';
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
    const city = getRandomItem(Object.keys(Cities)) as keyof typeof Cities;
    const { latitude, longitude } = CityCoordinates[city];

    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const previewImage = getRandomItem(this.mockData.photos);
    const photos = getRandomItems(this.mockData.photos).join(',');
    const type = getRandomItem(Object.keys(OfferType));
    const amenities = getRandomItems(Object.keys(Amenities)).join(',');

    const isPremium = Math.random() < 0.5 ? BooleanString.TRUE : BooleanString.FALSE;
    const rooms = generateRandomValue(limitsForMocks.MIN_ROOMS, limitsForMocks.MAX_ROOMS).toString();
    const guests = generateRandomValue(limitsForMocks.MIN_GUESTS, limitsForMocks.MAX_GUESTS).toString();
    const cost = generateRandomValue(limitsForMocks.MIN_COST, limitsForMocks.MAX_COST).toString();

    const userName = getRandomItem(this.mockData.userNames);
    const userEmail = getRandomItem(this.mockData.userEmails);
    const userAvatar = getRandomItem(this.mockData.avatars);
    const userType = Math.random() < 0.5 ? UserType.Regular : UserType.Pro;

    const coordinates = `${latitude},${longitude}`;

    return [
      title, description, city, previewImage, photos,
      isPremium, type, rooms,
      guests, cost, amenities, userName, userEmail,
      userAvatar, userType, coordinates
    ].join('\t');
  }
}
