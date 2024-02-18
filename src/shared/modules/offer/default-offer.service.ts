import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { UpdateOfferDto, OfferEntity, OfferService, CreateOfferDto, DEFAULT_OFFER_COUNT } from './index.js';
import mongoose from 'mongoose';
import { PipelineStage } from 'mongoose';


@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    try {
      const newOffer = new this.offerModel({
        ...dto
      });
      const savedOffer = await newOffer.save();
      this.logger.info(`New offer created: ${savedOffer._id} by author`);
      return savedOffer;
    } catch (error) {
      this.logger.error('Error creating offer', error as Error);
      throw error;
    }
  }

  public async editOffer(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity>> {
    try {
      const updatedOffer = await this.offerModel
        .findByIdAndUpdate(offerId, dto, { new: true }).populate('authorId').exec();
      if (!updatedOffer) {
        throw new Error(`Offer with ID ${offerId} not found or author mismatch`);
      }
      this.logger.info(`Offer ${offerId} updated `);
      return updatedOffer;
    } catch (error) {
      this.logger.error('Error updating offer', error as Error);
      throw error;
    }
  }

  public async deleteOffer(offerId: string): Promise<void> {
    try {
      const result = await this.offerModel.findByIdAndDelete(offerId);
      if (!result) {
        throw new Error(`Offer with ID ${offerId} not found`);
      }
      this.logger.info(`Offer ${offerId} deleted `);
    } catch (error) {
      this.logger.error('Error deleting offer:', error as Error);
      throw error;
    }
  }

  public async getOfferById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offerObjectId = new mongoose.Types.ObjectId(offerId);
    let pipeline: PipelineStage[] = [{ $match: { _id: offerObjectId } }];

    if (userId) {
      pipeline = [...pipeline, ...this.addFavoriteFlagPipeline(userId)];
    }

    pipeline = [...pipeline, {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author'
      }
    }, { $unwind: '$author' }, { $limit: 1 }];

    const results = await this.offerModel.aggregate(pipeline).exec();

    if (results.length > 0) {
      this.logger.info(`Offer with ID ${offerId} found`);
      return results[0]; // Возвращаем первый (и единственный) результат агрегации
    } else {
      this.logger.warn(`Offer with ID ${offerId} not found`);
      return null; // Возвращаем null, если оффер не найден
    }
  }

  public async getAllOffers(userId?: string, limit: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    try {
      let pipeline: PipelineStage[] = [{ $sort: { createdAt: SortType.Down } }, { $limit: limit }];

      // Добавляем логику для авторизованных пользователей
      if (userId) {
        pipeline = [...pipeline, ...this.addFavoriteFlagPipeline(userId)];
      }

      // Добавляем информацию об авторе для всех офферов
      pipeline = [...pipeline, {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorId'
        }
      }, { $unwind: '$authorId' }];

      const offers = await this.offerModel.aggregate(pipeline).exec();
      this.logger.info('All offers fetched');
      return offers;
    } catch (error) {
      this.logger.error('Error fetching all offers:', error as Error);
      throw error;
    }
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async updateRatingAndCommentCount(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    // считаем новый средний рейтинг и количество комментариев
    const totalRating = offer.rating * offer.commentsCount + newRating;
    const newCommentsCount = offer.commentsCount + 1;
    const newAverageRating = totalRating / newCommentsCount;

    // обновляем оффер с новым средним рейтингом и кол-вом комментариев
    return this.offerModel.findByIdAndUpdate(offerId, {
      $set: { rating: newAverageRating },
      $inc: { commentsCount: 1 }
    }, { new: true }).exec();
  }

  public async getFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      { $match: { isFavorite: true } },
      { $sort: {createdAt: SortType.Down} },
      ...this.addFavoriteFlagPipeline(userId),
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorId'
        }
      },
      { $unwind: '$authorId' },
      {
        $project: { title: 1, postDate: 1, city: 1, previewImage: 1, isPremium: 1, isFavorite: 1, rating: 1, type: 1, cost: 1, commentsCount: 1 }
      }
    ]).exec();
  }

  public async getPremiumOffersByCity(city: string, userID?: string, limit: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    try {
      let pipeline: PipelineStage[] = [
        { $match: { city, isPremium: true } },
        { $sort: {createdAt: SortType.Down} },
        { $limit: limit },
      ];

      if (userID) {
        pipeline = [...pipeline, ...this.addFavoriteFlagPipeline(userID)];
      }

      pipeline = [...pipeline, {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorId'
        }
      }, { $unwind: '$authorId' },
      {
        $project: {
          title: 1, postDate: 1, city: 1, previewImage: 1, isPremium: 1, isFavorite: 1, rating: 1, type: 1, cost: 1, commentsCount: 1
        }
      }];

      const offers = await this.offerModel.aggregate(pipeline).exec();
      this.logger.info(`Premium offers fetched for city ${city}`);
      return offers;
    } catch (error) {
      this.logger.error('Error fetching premium offers by city:', error as Error);
      throw error;
    }
  }

  private addFavoriteFlagPipeline(userId: string): PipelineStage[] {
    const userIdObj = new mongoose.Types.ObjectId(userId);

    return [
      {
        $lookup: {
          from: 'users',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { _id: userIdObj } },
            { $project: { favoriteOffers: 1 } },
            { $unwind: '$favoriteOffers' },
            { $match: { 'favoriteOffers': { $eq: '$$offerId' } } },
          ],
          as: 'isFavoriteArray'
        }
      },
      {
        $addFields: {
          isFavorite: { $gt: [{ $size: '$isFavoriteArray' }, 0] }
        }
      },
      { $unset: 'isFavoriteArray' },
    ];
  }
}
