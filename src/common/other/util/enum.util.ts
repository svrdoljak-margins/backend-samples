const DEFAULT_SEPARATOR = ', ';

export class EnumUtil {
  /**
   * Joins enum values into a string, for improved readability.
   */
  static enumToString<T>(enumObject: T, separator = DEFAULT_SEPARATOR): string {
    return Object.keys(enumObject)
      .map((key) => enumObject[key])
      .join(separator);
  }
}
