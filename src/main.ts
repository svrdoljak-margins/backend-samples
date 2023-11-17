import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { customValidationPipe } from './common/other/exceptions/validation.pipe';
import { ignoreFaviconMiddleware } from './common/middlewares/ignore-favicon.middleware';
import { docsAuthMiddleware } from './common/middlewares/docs-auth.middleware';
import { swaggerConfig } from './common/other/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logging
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

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

  // OpenAPI (Swagger)
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  app.use('/docs*', docsAuthMiddleware);

  await app.listen(3000);
}

bootstrap();
