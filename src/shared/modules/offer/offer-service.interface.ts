import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentType } from '@typegoose/typegoose';

export interface OfferService {
  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  editOffer(id: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  deleteOffer(id: string): Promise<void>;
  getOfferById(id: string): Promise<DocumentType<OfferEntity>>;
  getAllOffers(limit: number): Promise<DocumentType<OfferEntity>[]>;
}
