import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { DefaultOfferService } from '../offer/index.js';
import { DEFAULT_COMMENT_COUNT, CreateCommentDto, CommentEntity, CommentService } from './index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.offerService.updateRatingAndCommentCount(dto.offerId, dto.rating);
    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string, count?: number): Promise<DocumentType<CommentEntity>[]> {
    const limit = count || DEFAULT_COMMENT_COUNT;
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
