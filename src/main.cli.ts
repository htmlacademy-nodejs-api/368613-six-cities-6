#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { CLIApplication, HelpCommand, VersionCommand, ImportCommand, GenerateCommand, Command } from './cli/index.js';
import { Component } from './shared/types/index.js';
import { TSVFileReaderFactory } from './shared/libs/file-reader/index.js';
import { FileWriter, TSVFileWriter } from './shared/libs/file-writer/index.js';
import { OfferGenerator, TSVOfferGenerator } from './shared/libs/offer-generator/index.js';

function bootstrap() {
  const container = new Container();
  container.bind<CLIApplication>(Component.CliApplication).to(CLIApplication).inSingletonScope();
  container.bind<Command>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
  container.bind<Command>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
  container.bind<Command>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  container.bind<Command>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();
  container.bind<FileWriter>(Component.FileWriter).to(TSVFileWriter).inSingletonScope();
  container.bind<OfferGenerator>(Component.OfferGenerator).to(TSVOfferGenerator).inSingletonScope();
  container.bind<TSVFileReaderFactory>(Component.TSVFileReaderFactory).to(TSVFileReaderFactory).inSingletonScope();


  const cliApplication = container.get<CLIApplication>(Component.CliApplication);

  cliApplication.processCommand(process.argv);
}
bootstrap();
