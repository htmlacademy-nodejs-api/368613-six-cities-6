import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentType } from '@typegoose/typegoose';

export interface OfferService {
  createOffer(dto: CreateOfferDto, authorId: string): Promise<DocumentType<OfferEntity>>;
  editOffer(id: string, dto: CreateOfferDto, authorId: string): Promise<DocumentType<OfferEntity>>;
  deleteOffer(id: string, authorId: string): Promise<void>;
  getOfferById(id: string): Promise<DocumentType<OfferEntity>>;
  getAllOffers(limit: number): Promise<DocumentType<OfferEntity>[]>;
}
