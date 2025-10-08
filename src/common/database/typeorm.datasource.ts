import 'reflect-metadata';

import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import {
  DatabaseConfig,
  NodeConfig,
  ProjectConfig,
} from '../config/env.validation';
import { Environment } from '../constants/environment.enum';
import { TypeOrmConfigService } from './typeorm-config.service';

loadEnv();

/**
 * Validates raw configuration data against the provided class schema.
 * @param cls - Class constructor used for validation.
 * @param data - Raw configuration values to validate.
 * @returns A validated configuration instance.
 */
function validateConfig<T>(cls: new () => T, data: Partial<T>): T {
  const instance = plainToInstance(cls, data, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(instance as object, {
    whitelist: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const message = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .filter(Boolean)
      .join('; ');

    throw new Error(
      `Configuration validation failed${message ? `: ${message}` : ''}`,
    );
  }

  return instance;
}

const databaseConfig = validateConfig(DatabaseConfig, {
  HOST: process.env.DATABASE_HOST,
  PORT: process.env.DATABASE_PORT
    ? Number(process.env.DATABASE_PORT)
    : undefined,
  USERNAME: process.env.DATABASE_USERNAME,
  PASSWORD: process.env.DATABASE_PASSWORD,
  NAME: process.env.DATABASE_NAME,
  SCHEMA: process.env.DATABASE_SCHEMA,
  SSL: process.env.DATABASE_SSL
    ? process.env.DATABASE_SSL === 'true' || process.env.DATABASE_SSL === '1'
    : undefined,
});

const nodeConfig = validateConfig(NodeConfig, {
  ENV: process.env.APP_NODE_ENV as Environment | undefined,
});

const projectConfig = validateConfig(ProjectConfig, {
  NAME: process.env.PROJECT_NAME,
  DESCRIPTION: process.env.PROJECT_DESCRIPTION,
  VERSION: process.env.PROJECT_VERSION,
});

const typeOrmConfigService = new TypeOrmConfigService(
  databaseConfig,
  nodeConfig,
  projectConfig,
);

const typeOrmModuleOptions = typeOrmConfigService.createTypeOrmOptions();

export const AppDataSource = new DataSource(
  typeOrmModuleOptions as DataSourceOptions,
);

export default AppDataSource;
