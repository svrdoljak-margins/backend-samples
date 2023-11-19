import { Module } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { WinstonModule } from 'nest-winston';

import { RootConfig } from 'src/common/config/env.validation';
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
export class AppModule {}
