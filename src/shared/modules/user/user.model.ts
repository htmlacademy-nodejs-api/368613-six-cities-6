import { Schema, Document, model } from 'mongoose';
import { User, UserType } from '../../types/index.js';

export interface UserDocument extends User, Document {}

const userSchema = new Schema({
  name: String,
  email: String,
  avatarPath: String,
  userType: {
    type: String,
    enum: Object.values(UserType), // берутся из UserType
  },
});

export const UserModel = model<UserDocument>('User', userSchema);

// для теста
// const user = new UserModel({
//   name: 'example',
//   email: 'example@example.com',
//   avatarPath: 'http://example.com/avatar.jpg',
//   userType: 'Regular'
// });
