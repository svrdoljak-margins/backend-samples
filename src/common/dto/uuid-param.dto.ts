import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/** Shared route parameter DTO for validating UUID identifiers. */
export class UuidParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id!: string;
}
