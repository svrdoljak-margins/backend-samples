import { Inject, Injectable } from '@nestjs/common';
import * as Client from '@sendgrid/client';
import * as SendGrid from '@sendgrid/mail';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { SendgridConfig } from 'src/common/config/env.validation';

import {
  AbstractEmailProvider,
  TEmailProviderContent,
} from '../interface/email-provider.interface';

@Injectable()
export class SendgridEmailService extends AbstractEmailProvider {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly config: SendgridConfig,
  ) {
    super();
    SendGrid.setApiKey(config.APIKEY);
    Client.setApiKey(config.APIKEY);
  }

  /**
   * Sends an email using the SendGrid API.
   * @param msg - The message to be sent.
   * @returns  Void
   */
  async sendEmail(msg: TEmailProviderContent): Promise<void> {
    try {
      await SendGrid.send(msg);
    } catch (err) {
      this.logger.setContext(SendgridEmailService.name);
      this.logger.error(err);
      if (err.response) {
        this.logger.error(err.response.body);
      }
      throw err;
    }
  }
}
