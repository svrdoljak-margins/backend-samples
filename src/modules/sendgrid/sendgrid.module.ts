import { Module } from '@nestjs/common';

import { AbstractEmailProvider } from './interface/email-provider.interface';
import { SendgridEmailService } from './providers/sendgrid.service';

@Module({
  providers: [
    SendgridEmailService,
    {
      provide: AbstractEmailProvider,
      useExisting: SendgridEmailService,
    },
  ],
  exports: [AbstractEmailProvider],
})
export class SendgridModule {}
