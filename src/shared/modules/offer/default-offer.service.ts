import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity} from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async createOffer(dto: CreateOfferDto, authorId: string): Promise<DocumentType<OfferEntity>> {
    try {
      const newOffer = new this.offerModel({
        ...dto,
        authorId,
      });
      const savedOffer = await newOffer.save();
      this.logger.info(`New offer created: ${savedOffer._id} by author ${authorId}`);
      return savedOffer;
    } catch (error) {
      this.logger.error('Error creating offer', error as Error);
      throw error;
    }
  }

  public async editOffer(id: string, dto: CreateOfferDto, authorId: string): Promise<DocumentType<OfferEntity>> {
    try {
      const updatedOffer = await this.offerModel.findOneAndUpdate(
        { _id: id, authorId },
        dto,
        { new: true }
      );
      if (!updatedOffer) {
        throw new Error(`Offer with ID ${id} not found or author mismatch`);
      }
      this.logger.info(`Offer ${id} updated by author ${authorId}`);
      return updatedOffer;
    } catch (error) {
      this.logger.error('Error updating offer', error as Error);
      throw error;
    }
  }

  public async deleteOffer(id: string, authorId: string): Promise<void> {
    try {
      const result = await this.offerModel.deleteOne({ _id: id, authorId });
      if (result.deletedCount === 0) {
        throw new Error(`Offer with ID ${id} not found or author mismatch`);
      }
      this.logger.info(`Offer ${id} deleted by author ${authorId}`);
    } catch (error) {
      this.logger.error('Error deleting offer:', error as Error);
      throw error;
    }
  }

  public async getOfferById(id: string): Promise<DocumentType<OfferEntity>> {
    try {
      const offer = await this.offerModel.findById(id);
      if (!offer) {
        throw new Error(`Offer with ID ${id} not found`);
      }
      return offer;
    } catch (error) {
      this.logger.error('Error fetching offer by ID:', error as Error);
      throw error;
    }
  }

  public async getAllOffers(limit: number = 60): Promise<DocumentType<OfferEntity>[]> {
    try {
      const offers = await this.offerModel.find().limit(limit);
      return offers;
    } catch (error) {
      this.logger.error('Error fetching all offers:', error as Error);
      throw error;
    }
  }
}
