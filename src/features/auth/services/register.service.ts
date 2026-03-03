import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterInput, AUTH_ROLES, USER_STATUS } from "../constants";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import { AuditService } from "@/features/audit-log/services/audit.service";
import { RecoveryService } from "./recovery.service";

/**
 * Service to handle user registration state machine (PENDING -> ACTIVE).
 */
export class RegisterService {
  /**
   * Start registration: Creates or Resumes a PENDING user.
   * Returns plain-text recovery codes to be shown on client.
   */
  static async start(input: RegisterInput) {
    const { email, password, name } = input;

    // 1. Check if registration is enabled globally
    const systemConfig = await prisma.systemConfig.findUnique({ 
      where: { id: "default" } 
    });
    
    if (systemConfig && systemConfig.enableRegistration === false) {
      throw new ForbiddenError("Registration is currently disabled by the administrator");
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.status === USER_STATUS.ACTIVE) {
      throw new ConflictError("User with this email already exists");
    }

    // 3. Prepare security credentials
    const hashedPassword = await bcrypt.hash(password, 10);
    const plainCodes = RecoveryService.generateCodes();
    const hashedCodes = await RecoveryService.hashCodes(plainCodes);

    let user;
    if (existingUser && existingUser.status === USER_STATUS.PENDING) {
      // 4a. RESUME: Update pending user with new password and fresh codes
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
          recoveryCodes: hashedCodes,
        }
      });
    } else {
      // 4b. INITIAL: Create new pending user
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: AUTH_ROLES.CUSTOMER,
          status: USER_STATUS.PENDING,
          recoveryCodes: hashedCodes,
        },
      });
    }

    // 5. Log the intent
    await AuditService.log({
      entityName: "User",
      entityId: user.id,
      action: "CREATE",
      metadata: { 
        method: "REGISTRATION_START",
        status: user.status
      }
    });

    // Return plain codes only to the client (NEVER save plain in DB)
    return {
      userId: user.id,
      email: user.email,
      recoveryCodes: plainCodes,
    };
  }

  /**
   * Verify registration: Moves PENDING user to ACTIVE.
   */
  static async verify(email: string, challengeCode: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundError("Registration session not found");
    }

    if (user.status !== USER_STATUS.PENDING) {
      throw new ValidationError("Account is already active or suspended");
    }

    // Check the code challenge
    const isValid = await RecoveryService.verifyChallenge(challengeCode, user.recoveryCodes);

    if (!isValid) {
      throw new ValidationError("Invalid recovery code challenge. Please paste the correct code.");
    }

    // Activate the user
    const activatedUser = await prisma.user.update({
      where: { email },
      data: {
        status: USER_STATUS.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    // Log the activation
    await AuditService.log({
      entityName: "User",
      entityId: activatedUser.id,
      action: "STATUS_CHANGE",
      metadata: { 
        previousStatus: "PENDING",
        currentStatus: "ACTIVE",
        method: "RECOVERY_VERIFICATION"
      }
    });

    return activatedUser;
  }
}
