import { Module } from '@nestjs/common';

import { AbstractNotificationProvider } from './interface/notification-provider.interface';
import { FirebaseService } from './providers/firebase.service';

@Module({
  providers: [
    FirebaseService,
    {
      provide: AbstractNotificationProvider,
      useExisting: FirebaseService,
    },
  ],
  exports: [AbstractNotificationProvider],
})
export class FirebaseModule {}
