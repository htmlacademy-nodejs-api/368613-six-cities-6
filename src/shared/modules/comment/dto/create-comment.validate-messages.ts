export const createCommntsValidationMessages = {
  text: {
    isString: 'text is required',
    length: 'text should be between 1 and 1024 characters',
  },
  rating: {
    isInt: 'rating is required',
    min: 'rating should be at least 1',
    max: 'rating should be at most 5',
  },
  offerId: {
    isMongoId: 'offerId is invalid',
  },
  authorId: {
    isMongoId: 'authorId is invalid',
  },
};
