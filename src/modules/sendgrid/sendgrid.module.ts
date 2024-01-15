import { Module } from '@nestjs/common';

import { EmailProviderToken } from './interface/email-provider.interface';
import { SendgridEmailService } from './providers/sendgrid.service';

@Module({
  providers: [
    SendgridEmailService,
    {
      provide: EmailProviderToken,
      useExisting: SendgridEmailService,
    },
  ],
  exports: [EmailProviderToken],
})
export class SendgridModule {}
