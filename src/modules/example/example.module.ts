import { Module } from '@nestjs/common';
import { ExampleService } from './services/example.service';
import { AbstractExampleService } from './abstract/example.abstract.service';

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
