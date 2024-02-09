export const UserType = {
  Regular: 'regular',
  Pro: 'pro'
};

export const BooleanString = {
  TRUE: 'true',
  FALSE: 'false'
} as const;

export const Cities = {
  Paris: 'Paris',
  Cologne: 'Cologne',
  Brussels: 'Brussels',
  Amsterdam: 'Amsterdam',
  Hamburg: 'Hamburg',
  Dusseldorf: 'Dusseldorf',
  Barcelona: 'Barcelona',
  Berlin: 'Berlin',
} as const;

export const CityCoordinates = {
  Paris: { latitude: 48.85661, longitude: 2.351499 },
  Cologne: { latitude: 50.938361, longitude: 6.959974 },
  Brussels: { latitude: 50.846557, longitude: 4.351697 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314 },
  Barcelona: { latitude: 41.385063, longitude: 2.173404 },
  Berlin: { latitude: 52.520008, longitude: 13.404954 },
} as const;

export const OfferType = {
  apartment: 'apartment',
  house: 'house',
  room: 'room',
  hotel: 'hotel',
  villa: 'villa'
} as const;

export const Amenities = {
  Breakfast: 'Breakfast',
  AirConditioning: 'Air conditioning',
  LaptopFriendlyWorkspace: 'Laptop friendly workspace',
  BabySeat: 'Baby seat',
  Towels: 'Towels',
  Washer: 'Washer',
  Fridge: 'Fridge',
  Garden: 'Garden',
  FreeParking: 'Free parking',
  Fireplace: 'Fireplace',
  SwimmingPool: 'Swimming pool',
  Beachfront: 'Beachfront',
  BBQ: 'BBQ',
} as const;

export type EnumValues<T> = T[keyof T];
