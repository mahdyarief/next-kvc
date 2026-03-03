import crypto from "crypto";
import bcrypt from "bcryptjs";
import { RECOVERY_CONFIG } from "../constants";

/**
 * Service to handle Recovery Code generation and verification.
 */
export class RecoveryService {
  /**
   * Generates a set of random recovery codes.
   */
  static generateCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < RECOVERY_CONFIG.CODE_COUNT; i++) {
      // Generate random hex string: XXXX-XXXX-XXXX
      const random = crypto.randomBytes(6).toString("hex").toUpperCase();
      const formatted = `${random.slice(0, 4)}-${random.slice(4, 8)}-${random.slice(8, 12)}`;
      codes.push(formatted);
    }
    return codes;
  }

  /**
   * Hashes a set of plain recovery codes for database storage.
   */
  static async hashCodes(codes: string[]): Promise<string[]> {
    return Promise.all(codes.map((code) => bcrypt.hash(code, 10)));
  }

  /**
   * Verifies if a plain code matches the hashed code at a specific index.
   */
  static async verifyChallenge(plainCode: string, hashedCodes: string[], index: number = RECOVERY_CONFIG.CHALLENGE_INDEX): Promise<boolean> {
    const targetHash = hashedCodes[index];
    if (!targetHash) return false;
    
    return bcrypt.compare(plainCode, targetHash);
  }
}
