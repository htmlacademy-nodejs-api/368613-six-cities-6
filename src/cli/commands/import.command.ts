import { Command } from './command.interface.js';
import { TSVFileReaderFactory } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/index.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { Offer } from '../../shared/types/index.js';
import { getMongoURI } from '../../shared/helpers/index.js';

const DEFAULT_DB_PORT = '27017';
export const DEFAULT_USER_PASSWORD = '123456';

@injectable()
export class ImportCommand implements Command {
  private fileReaderFactory: TSVFileReaderFactory;
  private salt: string;

  constructor(
    @inject(Component.TSVFileReaderFactory) fileReaderFactory: TSVFileReaderFactory,
    @inject(Component.DatabaseClient) private readonly databaseClient: MongoDatabaseClient,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ) {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.fileReaderFactory = fileReaderFactory;
    this.databaseClient = databaseClient;
    this.userService = userService;
    this.offerService = offerService;
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    console.log('Offer data after conversion:', offer);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.createOffer({
      authorId: user.id,
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      photos: offer.photos,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      cost: offer.cost,
      amenities: offer.amenities,
      commentsCount: offer.commentsCount,
      coordinates: offer.coordinates
    });

  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = this.fileReaderFactory.createTSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
