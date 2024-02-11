import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export interface OfferService {
  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  editOffer(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity>>;
  deleteOffer(offerId: string): Promise<void>;
  getOfferById(offerId: string): Promise<DocumentType<OfferEntity>>;
  getAllOffers(limit: number): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  updateRatingAndCommentCount(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null>
  getPremiumOffersByCity(city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  getFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
