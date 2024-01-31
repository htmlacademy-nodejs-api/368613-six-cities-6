import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import { Component } from '../shared/types/component.enum.js';
import { injectable, inject } from 'inversify';

@injectable()
export class CLIApplication {
  constructor(
    @inject(Component.HelpCommand) private readonly helpCommand: Command,
    @inject(Component.VersionCommand) private readonly versionCommand: Command,
    @inject(Component.ImportCommand) private readonly importCommand: Command,
    @inject(Component.GenerateCommand) private readonly generateCommand: Command,
    private readonly defaultCommand: string = '--help'
  ) {}

  public getCommand(commandName: string): Command {
    const commands: { [key: string]: Command } = {
      '--help': this.helpCommand,
      '--version': this.versionCommand,
      '--import': this.importCommand,
      '--generate': this.generateCommand
    };

    return commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command {
    return this.getCommand(this.defaultCommand);
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
