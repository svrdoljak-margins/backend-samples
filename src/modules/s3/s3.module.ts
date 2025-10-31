import { Module } from '@nestjs/common';

import { AbstractFileStorageProvider } from './abstract/file-storage.abstract.service';
import { S3Service } from './s3.service';

@Module({
  providers: [
    S3Service,
    {
      provide: AbstractFileStorageProvider,
      useExisting: S3Service,
    },
  ],
  exports: [AbstractFileStorageProvider],
})
export class S3Module {}
