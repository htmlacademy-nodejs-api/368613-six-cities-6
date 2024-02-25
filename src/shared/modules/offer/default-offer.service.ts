import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { UpdateOfferDto, OfferEntity, OfferService, CreateOfferDto, DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './index.js';
import mongoose from 'mongoose';
import { PipelineStage } from 'mongoose';

const ID_TO_STRING_PIPELINE: PipelineStage[] = [
  {
    $addFields: {
      id: { $toString: '$_id' } // Преобразуем _id в строку и сохраняем в поле id
    }
  },
  {
    $project: {
      _id: 0 // Удаляем поле _id
    }
  }
];

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const savedOffer = await this.offerModel.create(dto);
    console.log(savedOffer);
    this.logger.info(`New offer created: ${savedOffer.title} by author`);
    return savedOffer;
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

  public async deleteOffer(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    try {
      const result = await this.offerModel.findByIdAndDelete(offerId).exec();
      if (!result) {
        throw new Error(`Offer with ID ${offerId} not found`);
      }
      this.logger.info(`Offer ${offerId} deleted `);
      return result; // Add this line to return the deleted offer
    } catch (error) {
      this.logger.error('Error deleting offer:', error as Error);
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
    // Calculate the new average rating and comment count
    const currentRating = offer.rating ?? 0;
    const currentCommentsCount = offer.commentsCount ?? 0;
    const totalRating = currentRating * currentCommentsCount + newRating;
    const newCommentsCount = currentCommentsCount + 1;
    const newAverageRating = totalRating / newCommentsCount;
    // Update the offer with the new average rating and comment count
    const updatedOffer = await this.offerModel.findByIdAndUpdate(
      offerId,
      {
        $set: { rating: newAverageRating.toFixed(1) }, //  with one decimal place
        $inc: { commentsCount: 1 }
      },
      { new: true }
    ).exec();
    return updatedOffer;
  }

  public async getOfferById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offerObjectId = new mongoose.Types.ObjectId(offerId);
    const pipeline: PipelineStage[] = [
      { $match: { _id: offerObjectId } },
      ...ID_TO_STRING_PIPELINE,
      ...this.addFavoriteFlagPipeline(userId)];

    const results = await this.offerModel.aggregate(pipeline).exec();

    if (results.length > 0) {
      this.logger.info(`Offer with ID ${offerId} found`);
      const offer = results[0]; // первый (и единственный) результат запроса
      return this.offerModel.populate(offer, { path: 'authorId' }); // second argument as object with 'path' and 'model' properties
    } else {
      this.logger.warn(`Offer with ID ${offerId} not found`);
      return null; // null, если оффер не найден
    }
  }

  public async getAllOffers(userId?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    try {
      const pipeline: PipelineStage[] = [
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
        ...ID_TO_STRING_PIPELINE,
        ...this.addFavoriteFlagPipeline(userId) // всегда добавляем результат addFavoriteFlagPipeline в конвейер
      ];

      const offers = await this.offerModel.aggregate(pipeline).exec();
      this.logger.info('All offers fetched');

      return this.offerModel.populate(offers, { path: 'authorId' });
    } catch (error) {
      this.logger.error('Error fetching all offers:', error as Error);
      throw error;
    }
  }

  public async getFavoriteOffersByUser(userId: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    try {
      const offers = await this.offerModel.aggregate([
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
        ...ID_TO_STRING_PIPELINE,
        ...this.addFavoriteFlagPipeline(userId),
        { $match: { isFavorite: true } },
      ]).exec();

      return this.offerModel.populate(offers, { path: 'authorId' });
    } catch (error) {
      this.logger.error('Error fetching favorite offers by user:', error as Error);
      throw error;
    }
  }

  public async getPremiumOffersByCity(city: string, userID?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? PREMIUM_OFFER_COUNT;
    try {
      const pipeline: PipelineStage[] = [
        { $match: { city, isPremium: true } },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
        ...ID_TO_STRING_PIPELINE,
        ...this.addFavoriteFlagPipeline(userID)
      ];

      const offers = await this.offerModel.aggregate(pipeline).exec();
      this.logger.info(`Premium offers fetched for city ${city}`);
      return this.offerModel.populate(offers, { path: 'authorId' });
    } catch (error) {
      this.logger.error('Error fetching premium offers by city:', error as Error);
      throw error;
    }
  }

  private addFavoriteFlagPipeline(userId?: string): PipelineStage[] {
    if (!userId) {
      return [
        {
          $addFields: {
            isFavorite: false // Устанавливаем isFavorite как false для всех предложений
          }
        }
      ];
    }

    return [
      {
        $lookup: {
          from: 'users',
          let: { offerId: '$id' },
          pipeline: [
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
              $project: {
                favorites: {
                  $in: ['$$offerId', { $map: { input: '$favoriteOffers', as: 'fav', in: { $toString: '$$fav' } } }] // Преобразуем каждый элемент favoriteOffers в строку и проверяем наличие offerId
                }
              }
            }
          ],
          as: 'favoritesCheck'
        }
      },
      {
        $addFields: {
          isFavorite: {
            $arrayElemAt: ['$favoritesCheck.favorites', 0] // Используем результат проверки для установки isFavorite
          }
        }
      },
      {
        $project: {
          favoritesCheck: 0 // Удаляем временный favoritesCheck
        }
      }
    ];
  }
}
