#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCliApplicationContainer } from './cli/cli.container.js';
import { CLIApplication } from './cli/cli.application.js';

function bootstrap() {
  const appContainer = Container.merge(createCliApplicationContainer(), createUserContainer(), createOfferContainer());

  const cliApplication = appContainer.get<CLIApplication>(Component.CliApplication);
  cliApplication.processCommand(process.argv);
}
bootstrap();
