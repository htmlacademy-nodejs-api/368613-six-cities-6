import { Command } from './command.interface.js';
import { TSVFileReaderFactory } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/index.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { Offer } from '../../shared/types/index.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';

const DEFAULT_USER_PASSWORD = '123456';

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(Component.TSVFileReaderFactory) private readonly fileReaderFactory: TSVFileReaderFactory,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.DatabaseClient) private readonly databaseClient: MongoDatabaseClient,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
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
    const salt = this.config.get('SALT');
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, salt);

    await this.offerService.createOffer({
      authorId: user.id,
      title: offer.title,
      description: offer.description,
      city: offer.city,
      previewImage: offer.previewImage,
      photos: offer.photos,
      isPremium: offer.isPremium,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      cost: offer.cost,
      amenities: offer.amenities,
      coordinates: offer.coordinates,
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string): Promise<void> {
    console.info('Connecting to the database…');
    const uri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.databaseClient.connect(uri);
    console.info('Connected to the database.');


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
