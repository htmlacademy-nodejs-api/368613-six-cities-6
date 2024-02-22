import { ParamsDictionary, Query } from 'express-serve-static-core';

export type ParamOfferId = {
  offerId: string;
} | ParamsDictionary;

export type QueryUserId = {
  userId?: string;
} | Query;

