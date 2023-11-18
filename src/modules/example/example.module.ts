import { Module } from '@nestjs/common';

import { AbstractExampleService } from './abstract/example.abstract.service';
import { ExampleService } from './services/example.service';

@Module({
  providers: [ExampleService],
  exports: [
    {
      provide: AbstractExampleService,
      useClass: ExampleService,
    },
  ],
})
export class ExampleModule {}
