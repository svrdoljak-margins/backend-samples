/* eslint-disable @typescript-eslint/no-explicit-any */

export interface EmailProviderContact {
  to: string;
  from: string;
}

export interface EmailProviderStaticContent extends EmailProviderContact {
  subject: string;
  text: string;
  html?: string;
}

export interface EmailProviderDynamicContent extends EmailProviderContact {
  templateId: string;
  dynamicTemplateData?: { [key: string]: any };
}

export type TEmailProviderContent =
  | EmailProviderDynamicContent
  | EmailProviderStaticContent;

export interface IEmailProvider {
  /**
   * Sends an email through the email provider.
   * @param msg - The message to be sent.
   * @returns  Void
   */
  sendEmail(msg: TEmailProviderContent): Promise<void>;
}

export const EmailProviderToken = Symbol('EmailProviderService');
