import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { RootConfig } from '../config/env.validation';
import { LogColor } from '../other/constants/log-color.enum';
import { LogLevel } from '../other/constants/log-level';

import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions,
} from 'nest-winston';

export class WinstonConfig implements WinstonModuleOptionsFactory {
  constructor(private readonly config: RootConfig) {
    winston.addColors({
      error: LogColor.ERROR,
      warning: LogColor.WARNING,
      info: LogColor.INFO,
      debug: LogColor.DEBUG,
      verbose: LogColor.VERBOSE,
    });
  }

  private getLogFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        (msg) => `${msg.timestamp} ${msg.level}: ${msg.message}`,
      ),
      winston.format.errors({ stack: true }),
    );
  }

  private getLogTransports(): winston.transport[] {
    return [
      new winston.transports.DailyRotateFile({
        dirname: 'logs/',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
      }),
      new winston.transports.DailyRotateFile({
        dirname: 'logs/',
        filename: 'all-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'verbose',
      }),
    ];
  }

  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      levels: LogLevel,
      format: this.getLogFormat(),
      transports: [
        ...this.getLogTransports(),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            winston.format.printf(
              (msg) =>
                `${msg.timestamp} ${msg.level}:${
                  msg.code ? `(${msg.code}` : ''
                } ${msg.message}`,
            ),
          ),
        }),
      ],
    };
  }
}
