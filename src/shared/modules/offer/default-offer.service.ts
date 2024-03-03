import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { UpdateOfferDto, OfferEntity, OfferService, CreateOfferDto, DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT, DEFAULT_OFFER_PREVIEW, DEFAULT_IMAGES_COUNT, DEFAULT_OFFER_IMAGES } from './index.js';
import mongoose from 'mongoose';
import { PipelineStage } from 'mongoose';
import { generateRandomArray } from '../../helpers/common.js';

const ID_TO_STRING_PIPELINE: PipelineStage[] = [
  {
    $addFields: {
      id: { $toString: '$_id' }
    }
  },
  {
    $project: {
      _id: 0
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
    const images = generateRandomArray(DEFAULT_OFFER_IMAGES, DEFAULT_IMAGES_COUNT);
    console.log(images);
    const savedOffer = await this.offerModel.create({...dto, previewImage: DEFAULT_OFFER_PREVIEW[0], photos: images});
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
      return result;
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
    const currentRating = offer.rating ?? 0;
    const currentCommentsCount = offer.commentsCount ?? 0;
    const totalRating = currentRating * currentCommentsCount + newRating;
    const newCommentsCount = currentCommentsCount + 1;
    const newAverageRating = totalRating / newCommentsCount;
    const updatedOffer = await this.offerModel.findByIdAndUpdate(
      offerId,
      {
        $set: { rating: newAverageRating.toFixed(1) },
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
    console.log('из шоу', results);
    if (results.length > 0) {
      this.logger.info(`Offer with ID ${offerId} found`);
      const offer = results[0];
      return this.offerModel.populate(offer, { path: 'authorId' });
    } else {
      this.logger.warn(`Offer with ID ${offerId} not found`);
      return null;
    }
  }

  public async getAllOffers(userId?: string, city?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    try {
      const matchStage = city ? { city } : {};
      const pipeline: PipelineStage[] = [
        { $match: matchStage },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
        ...ID_TO_STRING_PIPELINE,
        ...this.addFavoriteFlagPipeline(userId)
      ];

      const offers = await this.offerModel.aggregate(pipeline).exec();
      this.logger.info('All offers fetched');

      return this.offerModel.populate(offers, { path: 'authorId' });
    } catch (error) {
      this.logger.error('Error fetching all offers:', error as Error);
      throw error;
    }
  }

  public async getFavoriteOffersByUser(userId: string, city?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    try {
      const matchStage = city ? { isFavorite: true, city } : { isFavorite: true };
      const offers = await this.offerModel.aggregate([
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
        ...ID_TO_STRING_PIPELINE,
        ...this.addFavoriteFlagPipeline(userId),
        { $match: matchStage }
      ]).exec();

      return this.offerModel.populate(offers, { path: 'authorId' });
    } catch (error) {
      this.logger.error('Error fetching favorite offers by user:', error as Error);
      throw error;
    }
  }

  public async getPremiumOffers(city?: string, userID?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? PREMIUM_OFFER_COUNT;
    try {
      const matchStage = city ? { isPremium: true, city } : { isPremium: true };

      const pipeline: PipelineStage[] = [
        { $match: matchStage },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit },
        ...ID_TO_STRING_PIPELINE,
        ...this.addFavoriteFlagPipeline(userID)
      ];

      const offers = await this.offerModel.aggregate(pipeline).exec();
      this.logger.info(`Premium offers fetched ${city ? `for city ${ city}` : ''}`);
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
            isFavorite: false
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
                  $in: ['$$offerId', { $map: { input: '$favoriteOffers', as: 'fav', in: { $toString: '$$fav' } } }]
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
            $arrayElemAt: ['$favoritesCheck.favorites', 0]
          }
        }
      },
      {
        $project: {
          favoritesCheck: 0
        }
      }
    ];
  }
}
