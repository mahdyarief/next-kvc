import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ForgetPasswordInput, USER_STATUS } from "../constants";
import { ValidationError } from "@/lib/errors";
import { AuditService } from "@/features/audit-log/services/audit.service";
import { RecoveryService } from "./recovery.service";

/**
 * Service to handle password resets via recovery codes.
 */
export class ResetService {
  /**
   * Reset user password using a specific recovery code index.
   */
  static async execute(input: ForgetPasswordInput) {
    const { email, recoveryCode, codeIndex, password } = input;

    // 1. Find active user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.status !== USER_STATUS.ACTIVE) {
      // Generic error to prevent account discovery
      throw new ValidationError("Invalid email or recovery code details");
    }

    // 2. Verify Recovery Code at the specified index
    const isValid = await RecoveryService.verifyChallenge(
      recoveryCode.trim(),
      user.recoveryCodes,
      codeIndex
    );

    if (!isValid) {
      throw new ValidationError("Verification failed. Please check the code index and try again.");
    }

    // 3. Update password (hash it first)
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    // 4. Log the high-value security event
    await AuditService.log({
      entityName: "User",
      entityId: updatedUser.id,
      action: "UPDATE",
      metadata: { 
        method: "RECOVERY_CODE_RESET",
        codeIndexUsed: codeIndex,
        ipAddress: "REDACTED" // In real app, capture IP
      }
    });

    return updatedUser;
  }
}
