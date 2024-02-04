#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { CLIApplication, HelpCommand, VersionCommand, ImportCommand, GenerateCommand, Command } from './cli/index.js';
import { Component } from './shared/types/index.js';
import { TSVFileReaderFactory } from './shared/libs/file-reader/index.js';
import { FileWriter, TSVFileWriter } from './shared/libs/file-writer/index.js';
import { OfferGenerator, TSVOfferGenerator } from './shared/libs/offer-generator/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createRestApplicationContainer } from './rest/rest.container.js';

function bootstrap() {
  const baseContainer = new Container();
  // Регистрация зависимостей для CLI
  baseContainer.bind<CLIApplication>(Component.CliApplication).to(CLIApplication).inSingletonScope();
  baseContainer.bind<Command>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
  baseContainer.bind<Command>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
  baseContainer.bind<Command>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  baseContainer.bind<Command>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();
  baseContainer.bind<FileWriter>(Component.FileWriter).to(TSVFileWriter).inSingletonScope();
  baseContainer.bind<OfferGenerator>(Component.OfferGenerator).to(TSVOfferGenerator).inSingletonScope();
  baseContainer.bind<TSVFileReaderFactory>(Component.TSVFileReaderFactory).to(TSVFileReaderFactory).inSingletonScope();
  // Объединение контейнеров из других частей приложения
  const appContainer = Container.merge(baseContainer,createRestApplicationContainer(), createUserContainer(), createOfferContainer());
  // Если есть другие контейнеры, объедините их аналогично
  // const appContainer = Container.merge(tempContainer, createOfferContainer());

  const cliApplication = appContainer.get<CLIApplication>(Component.CliApplication);
  cliApplication.processCommand(process.argv);
}
bootstrap();
