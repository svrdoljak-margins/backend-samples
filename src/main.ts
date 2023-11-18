import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { customValidationPipe } from './common/other/exceptions/validation.pipe';
import { ignoreFaviconMiddleware } from './common/middlewares/ignore-favicon.middleware';
import { createDocsAuthMiddleware } from './common/middlewares/docs-auth.middleware';
import { swaggerConfig } from './common/other/swagger/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RootConfig } from './common/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config
  const config = app.get(RootConfig);

  // Logging
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Input validation
  app.useGlobalPipes(customValidationPipe);

  // Ignore favicon requests to prevent unnecessary error logging
  app.use(ignoreFaviconMiddleware);

  // API versioning
  app.enableVersioning({
    defaultVersion: '1',
    prefix: 'api/v',
    type: VersioningType.URI,
  });

  // Security
  app.use(helmet());

  // OpenAPI (Swagger) Auth
  app.use(
    '/docs*',
    createDocsAuthMiddleware(config.SWAGGER.USERNAME, config.SWAGGER.PASSWORD),
  );

  // OpenAPI (Swagger)
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config.APP.PORT);
}

bootstrap();
