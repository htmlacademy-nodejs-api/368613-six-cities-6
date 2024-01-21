import got from 'got';
import { appendFile } from 'node:fs/promises';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    for (let i = 0; i < offerCount; i++) {
      await appendFile(
        filepath,
        `${tsvOfferGenerator.generate()}\n`,
        { encoding: 'utf8' }
      );
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

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
// фетч для 21 ноды проблема с типизацией
// /// <reference lib="dom" /> костыль для того чтобы работало
// import { Command } from './command.interface.js';
// import { MockServerData } from '../../shared/types/index.js';

// export class GenerateCommand implements Command {
//   private initialData: MockServerData;

//   private async load(url: string) {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       this.initialData = await response.json();
//     } catch (error) {
//       throw new Error(`Can't load data from ${url}: ${error}`);
//     }
//   }

//   public getName(): string {
//     return '--generate';
//   }

//   public async execute(...parameters: string[]): Promise<void> {
//     const [count, filepath, url] = parameters;
//     const offerCount = Number.parseInt(count, 10);

//     try {
//       await this.load(url);
//     } catch (error: unknown) {
//       console.error('Can\'t generate data');

//       if (error instanceof Error) {
//         console.error(error.message);
//       }
//     }

//     // логика генерации данных
//   }
// }
