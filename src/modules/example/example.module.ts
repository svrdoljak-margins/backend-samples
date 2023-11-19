import { Module } from '@nestjs/common';

import { AbstractExampleService } from './abstract/example.abstract.service';
import { ExampleService } from './services/example.service';

@Module({
  providers: [
    ExampleService,
    {
      provide: AbstractExampleService,
      useClass: ExampleService,
    },
  ],
  exports: [AbstractExampleService],
})
export class ExampleModule {}
