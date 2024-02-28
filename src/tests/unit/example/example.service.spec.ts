/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'reflect-metadata';

import { TestBed } from '@automock/jest';

import { ExampleService } from '../../../modules/example/services/example.service';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeAll(() => {
    const { unit } = TestBed.create(ExampleService).compile();
    service = unit;
  });

  describe('getExampleById', () => {
    it('should return example id', async () => {
      // Arrange
      const id = '1';

      // Act
      const result = service.getExampleById(id);

      // Assert
      expect(result).toContain(id);
    });
  });
});
