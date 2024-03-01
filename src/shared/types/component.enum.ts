export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),

  CliApplication: Symbol.for('CliApplication'),
  HelpCommand: Symbol.for('HelpCommand'),
  VersionCommand: Symbol.for('VersionCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  GenerateCommand: Symbol.for('GenerateCommand'),
  FileReader: Symbol.for('FileReader'),
  FileWriter: Symbol.for('FileWriter'),
  OfferGenerator: Symbol.for('OfferGenerator'),
  TSVFileReaderFactory: Symbol.for('TSVFileReaderFactory'),

  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel'),

  ExceptionFilter: Symbol.for('ExceptionFilter'),

  OfferController: Symbol.for('OfferController'),
  UserController: Symbol.for('UserController'),
  CommentController: Symbol.for('CommentController'),

  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),
} as const;
