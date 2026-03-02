import { prisma } from "@/lib/prisma";
import { AuditService } from "@/features/audit-log/services/audit.service";
import { NextRequest } from "next/server";

export interface SystemConfigUpdate {
  appName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  timezone?: string;
  enableRegistration?: boolean;
}

export class SettingsService {
  /**
   * Retrieves the current system configuration.
   */
  static async getConfig() {
    const config = await prisma.systemConfig.findUnique({
      where: { id: "default" },
    });
    return config || { id: "default", appName: "NEXT-KVC", timezone: "Asia/Jakarta", enableRegistration: true };
  }

  /**
   * Updates the global system configuration.
   */
  static async updateConfig(data: SystemConfigUpdate, request?: NextRequest) {
    const previous = await this.getConfig();

    const config = await prisma.systemConfig.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        appName: data.appName || "NEXT-KVC",
        logoUrl: data.logoUrl || "",
        timezone: data.timezone || "Asia/Jakarta",
        enableRegistration: data.enableRegistration ?? true,
      },
    });

    // Log the change
    await AuditService.log({
      entityName: "SystemConfig",
      entityId: "default",
      action: "UPDATE",
      previousData: previous as Record<string, unknown>,
      currentData: config as Record<string, unknown>,
      request,
    });

    return config;
  }
}
