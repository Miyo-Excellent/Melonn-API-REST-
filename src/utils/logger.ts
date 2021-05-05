import 'winston-mongodb';

import fs, { WriteStream } from 'fs';
import path from 'path';
import { lowerCase, upperCase } from 'lodash';
import {
  addColors,
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';
import { MongoDBTransportInstance } from 'winston-mongodb';

import config from 'config';

export type LoggerType = (filename: string, icon?: string) => Logger;

export type LoggerFileType = (
  filename: string,
) => transports.FileTransportInstance;

export type LogConfigurationType = (
  filename: string,
  icon?: string,
) => LoggerOptions;

export type MongodbTransportType = (
  filename: string,
) => MongoDBTransportInstance;

export type AccessLogStreamType = (filename: string) => WriteStream;

export const loggerColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

addColors(loggerColors);

const level = () => {
  const env = config.keys.environment || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

export const customFormat = (filename: string, icon?: string) => {
  const withIcon: string = icon ? ` ${icon}` : '';

  const label: string = `${upperCase(filename)}${withIcon}:`;

  return format.combine(
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.colorize({ all: true }),
    format.label({ label }),
    format.printf((info) => {
      const message = `${info.level}: ${info.label}: ${[info.timestamp]}: ${
        info.message
      }`;

      return message.trim();
    }),
  );
};

export const loggerConsole = new transports.Console({
  level: 'info',
});

export const loggerFile: LoggerFileType = (filename: string) =>
  new transports.File({
    level: 'info',
    filename: path.resolve(__dirname, `../logs/${filename}.log`),
    maxsize: 51200000,
    maxFiles: 5,
  });

export const mongodbTransport: MongodbTransportType = (filename: string) =>
  new transports.MongoDB({
    db: config.database.settings.uri,
    options: { useUnifiedTopology: true },
    collection: `${lowerCase(filename)}_logs`,
  });

export const logConfiguration: LogConfigurationType = (
  filename: string,
  icon: string = '📌',
) => ({
  level: level(),
  transports: [loggerConsole, loggerFile(filename), mongodbTransport(filename)],
  format: customFormat(filename, icon),
});

export const logger: LoggerType = (filename, icon) =>
  createLogger(logConfiguration(filename, icon));

export const accessLogStream: AccessLogStreamType = (filename) =>
  fs.createWriteStream(path.join(__dirname, `../logs/${filename}.log`), {
    flags: 'a',
  });

export default logger;
