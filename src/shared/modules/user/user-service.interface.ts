import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FavoritesDto } from './dto/favorite.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByID(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  addToFavorites(dto: FavoritesDto): Promise<DocumentType<UserEntity>>;
  removeFromFavorites(dto: FavoritesDto): Promise<DocumentType<UserEntity>>;
  removeFavoriteFromAllUsers(offerId: string): Promise<void>;
}
