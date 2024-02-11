import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';
import { Component, SortType } from '../../types/index.js';
import { UpdateOfferDto, OfferEntity, OfferService, CreateOfferDto, DEFAULT_OFFER_COUNT } from './index.js';

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

  public async getOfferById(offerId: string): Promise<DocumentType<OfferEntity>> {
    try {
      const offer = await this.offerModel.findById(offerId).populate('authorId').exec();
      if (!offer) {
        throw new Error(`Offer with ID ${offerId} not found`);
      }
      return offer;
    } catch (error) {
      this.logger.error('Error fetching offer by ID:', error as Error);
      throw error;
    }
  }

  public async getAllOffers(limit: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    try {
      const offers = await this.offerModel.find().sort({ createdAt: SortType.Down}).limit(limit).populate('authorId').exec();
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

  public async getPremiumOffersByCity(city: string, limit: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({city, isPremium: true})
      .sort({createdAt: SortType.Down})
      .limit(limit)
      .populate('authorId')
      .exec();
  }

  public async getFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', userId] } } },
            { $project: { favoriteOffers: 1 } }
          ],
          as: 'userFavorites'
        }
      },
      { $unwind: '$userFavorites' },// unwind - развернуть массив favoriteOffers для каждого пользователя в отдельную запись в результате запроса чтобы можно было фильтровать по favoriteOffers
      { $match: { 'userFavorites.favoriteOffers': { $in: ['$$offerId'] } } },
      {
        $project: {
          title: 1,
          postDate: 1,
          city: 1,
          previewImage: 1,
          isPremium: 1,
          isFavorite: 1,
          rating: 1,
          type: 1,
          cost: 1,
          //authorId: 1,
          commentsCount: 1,
        }
      }
    ]).exec();
  }
}
