import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/errors";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50, // Limit to last 50
  });

  return api.success(notifications);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  // Only SUPERADMIN can send notifications manually via this route
  if (!isAdmin(user.role)) {
    throw new ForbiddenError("Only admins can send notifications");
  }

  const { title, message, type, href, targetUserId, broadcast } = await req.json();

  if (broadcast) {
    // Send to ALL users
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    const notifications = allUsers.map((u: { id: string }) => ({
      userId: u.id,
      title,
      message,
      type: type || "INFO",
      href,
      read: false,
    }));

    await prisma.notification.createMany({ data: notifications });

    // Emit Socket.IO event for each user
    const io = (globalThis as any).io;
    if (io) {
      allUsers.forEach((u: { id: string }) => {
        io.to(`user:${u.id}`).emit("notification:new", {
          userId: u.id,
          title,
          message,
          type: type || "INFO",
          href,
          createdAt: new Date().toISOString(),
          read: false,
        });
      });
    }

    return api.success({ count: allUsers.length }, "Broadcast notification sent");
  } else if (targetUserId) {
    // Send to specific user
    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        title,
        message,
        type: type || "INFO",
        href,
      },
    });

    // Emit Socket.IO event
    const io = (globalThis as any).io;
    if (io) {
      io.to(`user:${targetUserId}`).emit("notification:new", {
        id: notification.id,
        userId: targetUserId,
        title,
        message,
        type: type || "INFO",
        href,
        createdAt: notification.createdAt,
      });
    }

    return api.success(notification, "Notification sent");
  }

  throw new ValidationError("Provide targetUserId or broadcast=true");
});

