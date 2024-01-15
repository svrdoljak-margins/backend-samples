/* eslint-disable @typescript-eslint/no-explicit-any */

import { MaybePromise } from 'src/common/types/maybe-promise.type';

export interface IFileStorageProvider {
  /**
   * Uploads a file to the storage.
   * @param params - Params for uploading a file
   * @returns Third-party service response
   */
  upload(params: any): MaybePromise<any>;

  /**
   * Deletes a photo by key.
   * @param key - Key of the file to be deleted
   * @returns Void
   */
  delete(key: string): MaybePromise<void>;
}

export const FileStorageProviderToken = Symbol('FileStorageProviderToken');
