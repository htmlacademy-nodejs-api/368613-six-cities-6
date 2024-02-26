import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware, DocumentExistsMiddleware, UploadFileMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './type/create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo} from './rdo/user.rdo.js';
import { FavoritesRdo } from './rdo/favorites.rdo.js';
import { LoginUserRequest } from './type/login-user-request.type.js';
import { AddFavoriteRequest, RemoveFavoriteRequest } from './type/favorite-request.type.js';
import { OfferService } from '../offer/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { FavoritesDto } from './dto/favorite.dto.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]});
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Patch,
      handler: this.addToFavorites,
      middlewares: [
        new ValidateDtoMiddleware(FavoritesDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId', true)
      ]
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId', true)]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIR'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async addToFavorites(
    { body }: AddFavoriteRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.addToFavorites(body);
    this.ok(res, fillDTO(FavoritesRdo, user));
  }

  public async removeFromFavorites(
    { body }: RemoveFavoriteRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.removeFromFavorites(body);
    this.ok(res, fillDTO(FavoritesRdo, user));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}

