import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { WinstonModule } from 'nest-winston';

import { RootConfig } from 'src/common/config/env.validation';
import { DatabaseModule } from 'src/common/database/database.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { WinstonOptions } from 'src/common/providers/winston.provider';

import { CategoryModule } from '../categories/categories.module';
import { ExampleModule } from '../example/example.module';
import { PlanningModule } from '../planning/planning.module';
import { TaskModule } from '../tasks/tasks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const envLoader = dotenvLoader({
  separator: '__',
  keyTransformer: (key: string) => {
    const segments = key.split('_');

    if (segments.length <= 1) {
      return key;
    }

    const [first, second, ...rest] = segments;

    if (rest.length === 0) {
      return `${first}__${second}`;
    }

    const restKey = rest.join('_');
    const normalizedRest =
      restKey === 'MAX_OUTPUT_TOKENS' ? rest.join('__') : restKey;

    return `${first}__${second}__${normalizedRest}`;
  },
});

@Module({
  imports: [
    // Environment variables
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: envLoader,
    }),

    // Logging
    WinstonModule.forRootAsync({
      useClass: WinstonOptions,
    }),

    // Modules
    DatabaseModule,
    CategoryModule,
    TaskModule,
    PlanningModule,
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
