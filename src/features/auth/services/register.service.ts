import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterInput, AUTH_ROLES } from "../constants";
import { ConflictError, ForbiddenError } from "@/lib/errors";
import { AuditService } from "@/features/audit-log/services/audit.service";

/**
 * Service to handle user registration.
 */
export class RegisterService {
  /**
   * Register a new user with CUSTOMER role.
   */
  static async execute(input: RegisterInput) {
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

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user explicitly with CUSTOMER role
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: AUTH_ROLES.CUSTOMER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    // 5. Log the registration
    await AuditService.log({
      entityName: "User",
      entityId: newUser.id,
      action: "CREATE",
      metadata: { 
        method: "REGISTRATION",
        email: newUser.email,
        role: newUser.role
      }
    });

    return newUser;
  }
}
