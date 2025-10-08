const DEFAULT_CHUNK_SIZE = 400;

export class ChunkUtils {
  /**
   * Splits an array into chunks of specified size.
   * @param data - Source array to split.
   * @param size - Desired chunk size.
   * @returns Array of chunked arrays.
   */
  static splitIntoChunks<T>(data: T[], size = DEFAULT_CHUNK_SIZE): T[][] {
    const blank: T[] = [];
    return data.reduce((result: T[][], token: T, i) => {
      const index = Math.floor(i / size);
      result[index] = blank.concat(
        result[index] || <T>(<unknown>[]),
        token,
      ) as T[];

      return result;
    }, []);
  }
}
