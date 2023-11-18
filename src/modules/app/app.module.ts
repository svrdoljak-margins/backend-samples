import * as winston from 'winston';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig } from 'src/common/config/env.validation';
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from 'src/common/providers/winston.provider';

@Module({
  imports: [
    // Environment variables
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({ separator: '_' }),
    }),

    // Logging
    WinstonModule.forRootAsync({
      imports: [TypedConfigModule],
      inject: [RootConfig],
      useClass: WinstonConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
