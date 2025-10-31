const DEFAULT_SEPARATOR = ', ';

export class EnumUtils {
  /**
   * Joins enum values into a string, for improved readability.
   * @param enumObject - Enum object to stringify.
   * @param separator - Separator placed between values.
   * @returns String containing the joined enum values.
   */
  static enumToString<T>(enumObject: T, separator = DEFAULT_SEPARATOR): string {
    return Object.keys(enumObject)
      .map((key) => enumObject[key])
      .join(separator);
  }
}
