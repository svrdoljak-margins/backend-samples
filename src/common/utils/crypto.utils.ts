import * as crypto from 'crypto';

import { compare, genSalt, hash } from 'bcrypt';

const HASH_DEFAULT_ROUNDS = 10;
const TOKEN_DEFAULT_LENGTH = 10;

export class CryptoUtils {
  /**
   * Generates a hash from a text.
   * @param password - Plain text to hash.
   * @param rounds - Number of hashing rounds.
   * @returns Hashed string.
   */
  static async generateHash(
    password: string,
    rounds = HASH_DEFAULT_ROUNDS,
  ): Promise<string> {
    return await hash(password, await genSalt(rounds));
  }

  /**
   * Validates a text against a hash.
   * @param text - Plain text to validate.
   * @param hash - Hash to compare against.
   * @returns True when the hash matches the text.
   */
  static async validateHash(text: string, hash: string): Promise<boolean> {
    return await compare(text, hash);
  }

  /**
   * Generates a token.
   * @param length - Desired token length.
   * @returns Generated token.
   */
  generateToken(length = TOKEN_DEFAULT_LENGTH): string {
    return crypto.randomBytes(length / 2).toString('hex');
  }
}
