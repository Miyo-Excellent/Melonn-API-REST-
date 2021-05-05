import express from 'express';
import { Logger } from 'winston';
import { Express } from 'express-serve-static-core';
import path from 'path';

import { logger, printHeader } from 'utils';
import Database from '../database';

export type ServerHandlersExtensionOptionTypes = {
  app?: Express;
  appName: string;
  secretSession: string;
  port: number;
  publicPath?: string;
};

export type ServerLoadType = () => void;

export default class ServerHandlersExtensionMixin {
  protected app: Express = express();
  protected serverLogger: Logger = logger('server', '📡');
  protected endpointsLogger: Logger = logger('endpoints', '⛓');
  protected appName: string = 'My API Rest';
  protected secretSession: string = 'SESSION SECRET';
  protected publicPath = path.resolve(__dirname, '../public');
  protected port: number = 5000;
  protected database: Database;

  constructor({
    app,
    appName,
    secretSession,
    port,
    publicPath,
  }: ServerHandlersExtensionOptionTypes) {
    if (app) this.app = app;
    if (publicPath) this.publicPath = publicPath;

    this.appName = appName;
    this.secretSession = secretSession;
    this.port = port;
  }

  protected onLoad: ServerLoadType = (): void => {
    const message: string = `The ${this.appName} is run on http://localhost:${this.port}`;

    this.serverLogger.info(message);
    printHeader(`| ${message} |`);
  };
}
