import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  editOffer(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity>>;
  deleteOffer(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getOfferById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  getAllOffers(userId?: string, city?: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  updateRatingAndCommentCount(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null>
  getPremiumOffers(city?: string, userId?: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  getFavoriteOffersByUser(userId?: string, city?:string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
}
