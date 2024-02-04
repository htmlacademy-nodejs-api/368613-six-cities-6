import { UserService } from './user-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import mongoose from 'mongoose';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    try {
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
}
