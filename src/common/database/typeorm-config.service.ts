import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import {
  DatabaseConfig,
  NodeConfig,
  ProjectConfig,
} from '../config/env.validation';
import { Environment } from '../constants/environment.enum';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly databaseConfig: DatabaseConfig,
    private readonly nodeConfig: NodeConfig,
    private readonly projectConfig: ProjectConfig,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDevelopment = this.nodeConfig.ENV === Environment.Development;

    return {
      type: 'postgres',
      host: this.databaseConfig.HOST,
      port: this.databaseConfig.PORT,
      username: this.databaseConfig.USERNAME,
      password: this.databaseConfig.PASSWORD,
      database: this.databaseConfig.NAME,
      schema: this.databaseConfig.SCHEMA,
      applicationName: this.projectConfig.NAME,
      autoLoadEntities: true,
      synchronize: false,
      logging: isDevelopment
        ? ['error', 'warn', 'schema', 'migration']
        : ['error'],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      ssl: this.databaseConfig.SSL
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    };
  }
}
