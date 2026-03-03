import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import "server-only";

// Configuration for brute force protection
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MINUTES = 15;
const CAPTCHA_SECRET = process.env.AUTH_SECRET || "fallback-secret-key"; // Secret for signing tokens

export interface CaptchaChallenge {
  id: string; // Token to prove identity
  question: string; // E.g. "14 + 7"
}

export class CaptchaService {
  /**
   * Tracks a failed login attempt for a specific IP.
   */
  static async recordFailedAttempt(ipAddress: string, email?: string) {
    const existing = await prisma.loginAttempt.findFirst({
      where: { ipAddress },
    });

    if (existing) {
      // If the lockout has expired, reset the count
      if (existing.expiresAt < new Date()) {
        await prisma.loginAttempt.update({
          where: { id: existing.id },
          data: {
            count: 1,
            expiresAt: new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000),
            email,
          },
        });
      } else {
        // Increment the count
        await prisma.loginAttempt.update({
          where: { id: existing.id },
          data: {
            count: existing.count + 1,
            email,
          },
        });
      }
    } else {
      // Create new record
      await prisma.loginAttempt.create({
        data: {
          ipAddress,
          email,
          count: 1,
          expiresAt: new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000),
        },
      });
    }
  }

  /**
   * Clears failed login attempts after a successful login.
   */
  static async clearAttempts(ipAddress: string) {
    await prisma.loginAttempt.deleteMany({
      where: { ipAddress },
    });
  }

  /**
   * Checks if an IP address requires a captcha.
   */
  static async requiresCaptcha(ipAddress: string): Promise<boolean> {
    const record = await prisma.loginAttempt.findFirst({
      where: { ipAddress },
    });

    if (!record) return false;

    // If lockout has expired, they get a fresh start
    if (record.expiresAt < new Date()) {
      // We could clear it here, but it will be reset on next failure or cleared on success
      return false;
    }

    return record.count >= MAX_FAILED_ATTEMPTS;
  }

  /**
   * Generates a simple math captcha challenge.
   */
  static generateChallenge(): CaptchaChallenge {
    // Generate random numbers between 1 and 20
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    
    // Pick a random operator (+ or -)
    const operators = ["+", "-"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    // Ensure num1 >= num2 for subtraction to avoid negative answers for simplicity
    let finalNum1 = num1;
    let finalNum2 = num2;
    if (operator === "-" && num1 < num2) {
      finalNum1 = num2;
      finalNum2 = num1;
    }

    const question = `${finalNum1} ${operator} ${finalNum2}`;
    
    // Calculate actual answer
    const answer = operator === "+" ? finalNum1 + finalNum2 : finalNum1 - finalNum2;

    // Sign the challenge data
    // The token contains the expected answer and a short expiration time (e.g. 5 mins)
    const token = jwt.sign(
      { a: answer },
      CAPTCHA_SECRET,
      { expiresIn: "5m" }
    );

    return {
      id: token,
      question,
    };
  }

  /**
   * Verifies the user's answer against the signed token.
   */
  static verifyChallenge(token: string | null | undefined, answer: string | null | undefined): boolean {
    if (!token || !answer) return false;

    try {
      // Verify signature and expiration
      const decoded = jwt.verify(token, CAPTCHA_SECRET) as { a: number };
      
      // Check if the provided answer matches the signed expected answer
      // Convert answer to a number for comparison
      const userAnswerNum = parseInt(answer.trim(), 10);
      
      return decoded.a === userAnswerNum;
    } catch (_error) {
      // Token is expired, invalid, or tampered with
      return false;
    }
  }
}
