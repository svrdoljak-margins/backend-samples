import { PutObjectCommandOutput } from '@aws-sdk/client-s3';

import { IS3Params } from '../interface/s3-params.interface';

/** Contract for file storage providers used within the application. */
export abstract class AbstractFileStorageProvider {
  /** Uploads a file to the storage backend. */
  abstract upload(params: IS3Params): Promise<PutObjectCommandOutput>;

  /** Removes a file identified by the provided key. */
  abstract delete(key: string): Promise<void>;
}
