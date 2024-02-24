import { UserService } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import mongoose from 'mongoose';
import { DefaultOfferService } from '../offer/index.js';
import { FavoritesDto } from './dto/favorite.dto.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';


@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    try {
      console.log(dto);
      const user = new UserEntity(dto);
      user.setPassword(dto.password, salt);
      console.log(`Creating user with userType: ${dto.userType}`);

      const result = await this.userModel.create(user);
      this.logger.info(`New user created: ${user.email}`);

      return result;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError && error.errors.userType) {
        throw new Error('User type is required');
      }
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findByID(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id);
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async addToFavorites(dto: FavoritesDto): Promise<DocumentType<UserEntity>> {
    const { userId, offerId } = dto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    // Проверяем, есть ли уже такой offerId в массиве favoriteOffers
    if (!user.favoriteOffers.includes(offerId)) {
      user.favoriteOffers.push(offerId); // Добавляем строку, а не ObjectId
      await user.save();
    }

    return user;
  }

  public async removeFromFavorites(dto: FavoritesDto): Promise<DocumentType<UserEntity>> {
    const { userId, offerId } = dto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    // Удаляем offerId из массива favoriteOffers
    user.favoriteOffers = user.favoriteOffers.filter((id) => id !== offerId);
    await user.save();

    return user;
  }

  public async removeFavoriteFromAllUsers(offerId: string): Promise<void> {
    await this.userModel.updateMany(
      { favoriteOffers: offerId },
      { $pull: { favoriteOffers: offerId } }
    );
  }
}
