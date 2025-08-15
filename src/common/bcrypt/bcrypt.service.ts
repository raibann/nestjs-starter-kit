import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  /**
   * Hash a plain text password
   * @param plainText - The plain text to hash
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Promise<string> - The hashed value
   */
  async hash(plainText: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  /**
   * Compare a plain text with a hash
   * @param plainText - The plain text to compare
   * @param hash - The hash to compare against
   * @returns Promise<boolean> - True if they match, false otherwise
   */
  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  /**
   * Generate a salt
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Promise<string> - The generated salt
   */
  async genSalt(saltRounds: number = 10): Promise<string> {
    return bcrypt.genSalt(saltRounds);
  }

  /**
   * Hash a plain text with a specific salt
   * @param plainText - The plain text to hash
   * @param salt - The salt to use
   * @returns Promise<string> - The hashed value
   */
  async hashWithSalt(plainText: string, salt: string): Promise<string> {
    return bcrypt.hash(plainText, salt);
  }
}
