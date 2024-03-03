import { Container } from 'inversify';
import { CLIApplication, HelpCommand, VersionCommand, ImportCommand, GenerateCommand, Command } from './index.js';
import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { TSVFileReaderFactory } from '../shared/libs/file-reader/index.js';
import { FileWriter, TSVFileWriter } from '../shared/libs/file-writer/index.js';
import { OfferGenerator, TSVOfferGenerator } from '../shared/libs/offer-generator/index.js';


export function createCliApplicationContainer() {
  const cliApplicationContainer = new Container();
  cliApplicationContainer.bind<CLIApplication>(Component.CliApplication).to(CLIApplication).inSingletonScope();
  cliApplicationContainer.bind<Command>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
  cliApplicationContainer.bind<Command>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
  cliApplicationContainer.bind<Command>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  cliApplicationContainer.bind<Command>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();
  cliApplicationContainer.bind<FileWriter>(Component.FileWriter).to(TSVFileWriter).inSingletonScope();
  cliApplicationContainer.bind<OfferGenerator>(Component.OfferGenerator).to(TSVOfferGenerator).inSingletonScope();
  cliApplicationContainer.bind<TSVFileReaderFactory>(Component.TSVFileReaderFactory).to(TSVFileReaderFactory).inSingletonScope();
  cliApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  cliApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  cliApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return cliApplicationContainer;
}
