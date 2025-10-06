/* eslint-disable @typescript-eslint/no-explicit-any */

import { INotificationTokenPair } from 'src/modules/firebase/interface/notification-token-pair.interface';

export abstract class AbstractNotificationProvider {
  /**
   * Sends notification to a single device.
   * @param pair - Pair of notification and device token.
   * @returns  Void
   **/
  abstract sendOneNotification(pair: INotificationTokenPair): Promise<void>;

  /**
   * Sends multiple notification, each notification to the corresponding device.
   * @param tokenPairs - Pairs of notification and device token.
   * @returns  Void
   */
  abstract sendMultipleNotifications(
    tokenPairs: INotificationTokenPair[],
  ): Promise<void>;

  /**
   * Maps notification data to the format that the third-party service expects.
   * @param pairs - Pairs of notification and device token.
   * @returns  Data in the format that the third-party service expects.
   */
  abstract mapNotificationData(...pairs: INotificationTokenPair[]): any;
}
