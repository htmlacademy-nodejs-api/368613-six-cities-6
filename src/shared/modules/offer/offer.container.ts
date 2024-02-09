import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';

export function createOfferContainer() {
  const userContainer = new Container();
  userContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  userContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return userContainer;
}
