export const userValidationMessages = {
  name: {
    isString: 'Name must be a string',
    length: 'Name must be between 1 and 15 characters'
  },
  email: {
    isEmail: 'Email must be a valid email',
  },
  avatarPath: {
    isString: 'AvatarPath must be a string',
  },
  password: {
    isString: 'Password must be a string',
    length: 'Password must be between 6 and 12 characters'
  },
  userType: {
    isEnum: 'UserType must be one of the predefined values',
  }
} as const;
