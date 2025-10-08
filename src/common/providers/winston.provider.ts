import { Injectable } from '@nestjs/common';
import { getId as getCorrelationId } from 'express-correlation-id';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { LogColor } from '../constants/log-color.enum';
import { LogLevel } from '../constants/log-level';

@Injectable()
export class WinstonOptions implements WinstonModuleOptionsFactory {
  constructor() {
    winston.addColors({
      error: LogColor.ERROR,
      warning: LogColor.WARNING,
      info: LogColor.INFO,
      debug: LogColor.DEBUG,
      verbose: LogColor.VERBOSE,
    });
  }

  private getLogFormat(): winston.Logform.Format {
    /**
     * Builds the log formatter used across transports.
     * @returns Winston log format configuration.
     */
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        (msg) =>
          `${getCorrelationId() ?? 'System'} |  ${msg.timestamp} ${
            msg.level
          }: ${msg.message}`,
      ),
      winston.format.errors({ stack: true }),
    );
  }

  private getLogTransports(): winston.transport[] {
    /**
     * Configures base log transports for file rotation.
     * @returns Array of Winston transports.
     */
    return [
      new DailyRotateFile({
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

  /**
   * Creates Winston module options consumed by Nest.
   * @returns Winston options object.
   */
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
                `${getCorrelationId() ?? 'System'} ${msg.timestamp} ${
                  msg.level
                }:${msg.code ? `(${msg.code}` : ''} ${msg.message}`,
            ),
          ),
        }),
      ],
    };
  }
}
