import 'reflect-metadata';

import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { customValidationPipe } from '../src/common/exceptions/validation.pipe';
import { TaskManagerExceptionFilter } from '../src/common/exceptions/task-manager-exception.filter';
import { ignoreFaviconMiddleware } from '../src/common/middlewares/ignore-favicon.middleware';
import { AppModule } from '../src/modules/app/app.module';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      app?: INestApplication;
      appModule?: TestingModule;
      dataSource?: DataSource;
    }
  }
}

beforeAll(async () => {
  if (global.app) {
    return;
  }

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors();
  app.useGlobalPipes(customValidationPipe);
  app.use(ignoreFaviconMiddleware);
  app.enableVersioning({
    defaultVersion: '1',
    prefix: 'api/v',
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new TaskManagerExceptionFilter());

  await app.init();

  global.appModule = moduleFixture;
  global.app = app;
  global.dataSource = app.get(DataSource);
});

afterAll(async () => {
  await global.app?.close();
});
