import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { AuditService } from "@/features/audit-log/services/audit.service";
import { NotificationType } from "../types";
import { NextRequest } from "next/server";

export interface CreateNotificationParams {
  title: string;
  message: string;
  type?: NotificationType;
  href?: string;
  targetUserId?: string;
  broadcast?: boolean;
  request?: NextRequest;
}

export class NotificationService {
  /**
   * Dispatches notifications to one or all users.
   */
  static async dispatch(params: CreateNotificationParams) {
    const { title, message, type = "INFO", href, targetUserId, broadcast, request } = params;

    if (broadcast) {
      const allUsers = await prisma.user.findMany({ select: { id: true } });
      const notifications = allUsers.map((u) => ({
        id: crypto.randomUUID(),
        userId: u.id,
        title,
        message,
        type,
        href,
        read: false,
      }));

      await prisma.notification.createMany({ data: notifications });

      // Socket.IO Integration
      const io = (globalThis as unknown as { io?: { to: (room: string) => { emit: (event: string, data: unknown) => void } } }).io;
      if (io) {
        notifications.forEach((n) => {
          io.to(`user:${n.userId}`).emit("notification:new", {
            ...n,
            createdAt: new Date().toISOString(),
          });
        });
      }

      await AuditService.log({
        entityName: "Notification",
        entityId: "broadcast",
        action: "CREATE",
        metadata: { title, targetCount: allUsers.length },
        request,
      });

      return { count: allUsers.length };
    } else if (targetUserId) {
      const notification = await prisma.notification.create({
        data: {
          userId: targetUserId,
          title,
          message,
          type,
          href,
        },
      });

      // Socket.IO Integration
      const io = (globalThis as unknown as { io?: { to: (room: string) => { emit: (event: string, data: unknown) => void } } }).io;
      if (io) {
        io.to(`user:${targetUserId}`).emit("notification:new", {
          ...notification,
          createdAt: notification.createdAt.toISOString(),
        });
      }

      await AuditService.log({
        entityName: "Notification",
        entityId: notification.id,
        action: "CREATE",
        metadata: { title, targetUserId },
        request,
      });

      return notification;
    }

    throw new Error("Target user or broadcast must be specified");
  }

  /**
   * Fetches latest notifications for a user.
   */
  static async getForUser(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  /**
   * Marks specific notifications as read.
   */
  static async markAsRead(userId: string, ids?: string[]) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        id: ids?.length ? { in: ids } : undefined,
      },
      data: { read: true },
    });
  }

  /**
   * Deletes a specific notification.
   */
  static async delete(userId: string, id: string) {
    return await prisma.notification.delete({
      where: { id, userId },
    });
  }
}
