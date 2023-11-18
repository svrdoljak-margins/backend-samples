import { Injectable } from '@nestjs/common';

import { AbstractExampleService } from '../abstract/example.abstract.service';

@Injectable()
export class ExampleService extends AbstractExampleService {
  constructor() {
    super();
  }

  /**
   * Gets example by ID.
   */
  getExampleById(id: number): string {
    return `Example #${id}`;
  }
}
