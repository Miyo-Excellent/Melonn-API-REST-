import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';

import { ServerHandlersExtensionMixin } from 'mixins';
import Database from 'database';
import Router from 'Router';
import { morganMiddleware } from 'middlewares';
import config from 'config';

export type ServerOptionTypes = {
  appName: string;
  secretSession: string;
  port: number;
  databaseUri: string;
};

type ServerMainType = () => void;

type ServerStartOptionsType = () => void;

export default class Server extends ServerHandlersExtensionMixin {
  protected database: Database;
  protected router: Router = new Router();

  constructor(options: ServerOptionTypes) {
    super(options);

    const { appName, secretSession, port, databaseUri } = options;

    if (!!appName) this.appName = appName;
    if (!!secretSession) this.secretSession = secretSession;
    if (!!port) this.port = port;

    this.database = new Database({ uri: databaseUri });

    this.main();
  }

  public start: ServerStartOptionsType = () => {
    this.database.connect().then(async () => {
      await this.database.setup(config.database);

      this.app.listen(this.app.get('port'), this.onLoad);
    });
  };

  private main: ServerMainType = (): void => {
    this.app.set('port', this.port);
    this.app.set('session', this.secretSession);

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({}));
    this.app.use(express.static(this.publicPath));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(
      morganMiddleware(({ message, status }) => {
        if (status >= 200 && status <= 299) {
          return this.endpointsLogger.info(message);
        }

        if (status >= 300 && status <= 399) {
          return this.endpointsLogger.warn(message);
        }

        if (status >= 400 && status <= 499) {
          return this.endpointsLogger.error(message);
        }

        if (status >= 500 && status <= 599) {
          return this.endpointsLogger.error(message);
        }
      }),
    );
    this.app.use(this.router.router);
  };
}
