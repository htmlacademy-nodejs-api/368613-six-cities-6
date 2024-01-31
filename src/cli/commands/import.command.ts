import { Command } from './command.interface.js';
import { TSVFileReaderFactory } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/index.js';

@injectable()
export class ImportCommand implements Command {
  private fileReaderFactory: TSVFileReaderFactory;

  constructor(@inject(Component.TSVFileReaderFactory) fileReaderFactory: TSVFileReaderFactory) {
    this.fileReaderFactory = fileReaderFactory;
  }

  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = this.fileReaderFactory.createTSVFileReader(filename);

    fileReader.on('line', this.onImportedLine.bind(this));
    fileReader.on('end', this.onCompleteImport.bind(this));

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}

