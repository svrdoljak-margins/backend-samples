import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { WinstonModule } from 'nest-winston';

import { RootConfig } from 'src/common/config/env.validation';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { WinstonOptions } from 'src/common/providers/winston.provider';

import { ExampleModule } from '../example/example.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Environment variables
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({ separator: '_' }),
    }),

    // Logging
    WinstonModule.forRootAsync({
      useClass: WinstonOptions,
    }),

    // Modules
    ExampleModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .exclude('/')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
