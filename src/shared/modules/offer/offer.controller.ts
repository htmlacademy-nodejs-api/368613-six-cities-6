import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OfferService } from './offer-service.interface.js';
import { ParamOfferId, ParamCity } from './type/param-offerid.type.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OffersListRdo } from './rdo/offers-list.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { RequestQuery } from '../../libs/rest/types/request-query.type.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/index.js';
import { UserService } from '../user/user-service.interface.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService

  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavoriteOffersByUser });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffersByCity });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getComments });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.edit });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async show({ params, query }: Request<ParamOfferId, RequestQuery>, res: Response): Promise<void> {
    const { offerId } = params;
    const userId = query?.userId?.toString() ?? '';
    const offer = await this.offerService.getOfferById(offerId, userId);

    if (! offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async index({ query }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.getAllOffers(query.userId, query.limit);

    this.ok(res, offers.map((offer) => fillDTO(OffersListRdo, offer)));
  }

  public async getFavoriteOffersByUser({ query }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.getFavoriteOffersByUser(query.userId, query.limit);

    this.ok(res, offers.map((offer) => fillDTO(OffersListRdo, offer)));
  }

  public async create({ body }: Request<ParamOfferId, CreateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.createOffer(body);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteOffer(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    await this.commentService.deleteByOfferId(offerId);
    await this.userService.removeFavoriteFromAllUsers(offerId);
    this.noContent(res, offer);
  }

  public async edit({ params, body }: Request<ParamOfferId, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.editOffer(offerId, body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found or author mismatch.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getPremiumOffersByCity({ params, query }: Request<ParamCity,unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const { city } = params;
    const offers = await this.offerService.getPremiumOffersByCity(city, query.userId, query.limit);

    this.ok(res, offers.map((offer) => fillDTO(OffersListRdo, offer)));
  }

  public async getComments({ params, query }: Request<ParamOfferId, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId, query.limit);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
