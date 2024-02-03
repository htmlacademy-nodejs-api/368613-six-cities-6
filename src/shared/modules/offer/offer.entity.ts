import { prop, getModelForClass, modelOptions, Ref, defaultClasses } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js'; // Предполагаем, что UserEntity уже определен
import { Cities, OfferType, Amenities, EnumValues } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps{
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true, enum: Object.values(Cities) })
  public city!: EnumValues<typeof Cities>;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, enum: Object.values(OfferType) })
  public type!: EnumValues<typeof OfferType>;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public cost!: number;

  @prop({ required: true, type: () => [String], enum: Object.values(Amenities) })
  public amenities!: EnumValues<typeof Amenities>[];

  @prop({ required: true, ref: () => UserEntity })
  public authorId!: Ref<UserEntity>;

  @prop({ default: 0})
  public commentsCount!: number;

  @prop({ required: true })
  public coordinates!: { latitude: number; longitude: number; };
}

export const OfferModel = getModelForClass(OfferEntity);
