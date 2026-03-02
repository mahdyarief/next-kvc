import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/features/auth/server/api-auth";
import { NextRequest } from "next/server";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "STATUS_CHANGE";

export interface AuditOptions {
  entityName: string;
  entityId: string;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  currentData?: Record<string, unknown>;
  watchFields?: string[];
  request?: NextRequest;
}

/**
 * Service to handle audit logging in the system.
 */
export class AuditService {
  /**
   * Generates a shallow diff between two objects.
   */
  private static buildDiff(
    prev: Record<string, unknown>,
    curr: Record<string, unknown>,
    watchFields?: string[]
  ): Record<string, [unknown, unknown]> {
    const diff: Record<string, [unknown, unknown]> = {};
    const excludedFields = new Set(["id", "createdAt", "updatedAt", "createdById", "updatedById"]);
    
    const keys = watchFields ?? Object.keys({ ...prev, ...curr });

    for (const key of keys) {
      if (excludedFields.has(key)) continue;
      
      const oldVal = prev[key];
      const newVal = curr[key];

      // Simple deep equality check for primitives, dates, and plain objects
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        diff[key] = [oldVal, newVal];
      }
    }

    return diff;
  }

  /**
   * Logs an action to the AuditLog table.
   */
  static async log(options: AuditOptions) {
    const { 
      entityName, 
      entityId, 
      action, 
      metadata, 
      previousData, 
      currentData, 
      watchFields,
      request 
    } = options;

    try {
      // Get actor information
      const user = await getAuthenticatedUser(request);
      const actorId = user?.id || "system";
      const actorLabel = user?.email || "System";

      // Calculate diff if both previous and current data are provided
      let diffStr: string | null = null;
      if (previousData && currentData) {
        const diff = this.buildDiff(previousData, currentData, watchFields);
        // If there's no diff and it was an update, we can skip logging if preferred
        if (action === "UPDATE" && Object.keys(diff).length === 0) {
          return null;
        }
        diffStr = JSON.stringify(diff);
      }

      // Get request metadata if available
      const ipAddress = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || null;
      const userAgent = request?.headers.get("user-agent") || null;

      // Write to database
      return await prisma.auditLog.create({
        data: {
          entityName,
          entityId,
          action,
          actorId,
          actorLabel,
          diff: diffStr,
          metadata: metadata ? JSON.stringify(metadata) : null,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      // Fail silently for audit logs to avoid breaking business logic
      console.error("[AuditService] Failed to create audit log:", error);
      return null;
    }
  }
}
