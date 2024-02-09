import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/index.js';

@injectable()
export class GenerateCommand implements Command {
  private initialData: MockServerData;

  constructor(
    @inject(Component.OfferGenerator) private readonly offerGenerator: TSVOfferGenerator,
    @inject(Component.FileWriter) private readonly fileWriter: TSVFileWriter
  ) {}

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    this.fileWriter.initializeStream(filepath); // Инициализируем поток для записи
    this.offerGenerator.setMockData(this.initialData); // Инициализируем offerGenerator данными

    for (let i = 0; i < offerCount; i++) {
      await this.fileWriter.write(this.offerGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
