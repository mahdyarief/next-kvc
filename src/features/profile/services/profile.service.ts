import { prisma } from "@/lib/prisma";
import { AuditService } from "@/features/audit-log/services/audit.service";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  password?: string;
}

export class ProfileService {
  /**
   * Retrieves the current user's full profile
   */
  static async getProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Updates user profile data
   */
  static async updateProfile(userId: string, data: ProfileUpdateData, request?: NextRequest) {
    const previous = await prisma.user.findUnique({ where: { id: userId } });
    if (!previous) throw new Error("User not found");

    const updateData: Partial<ProfileUpdateData> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Log the change (masking sensitive fields in diff)
    await AuditService.log({
      entityName: "User",
      entityId: userId,
      action: "UPDATE",
      previousData: { name: previous.name, email: previous.email },
      currentData: { name: updated.name, email: updated.email },
      metadata: { fields: Object.keys(updateData).filter(k => k !== 'password') },
      request,
    });

    return updated;
  }
}
