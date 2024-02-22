// favorite-request.type.ts
import { Request } from 'express';
import { RequestParams, RequestBody } from '../../libs/rest/index.js';
import { FavoritesDto } from './dto/favorite.dto.js';

export type AddFavoriteRequest = Request<RequestParams, RequestBody, FavoritesDto>;
export type RemoveFavoriteRequest = Request<RequestParams, RequestBody, FavoritesDto>;
