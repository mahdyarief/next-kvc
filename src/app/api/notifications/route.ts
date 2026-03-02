import { NextRequest } from "next/server";
import { getAuthenticatedUser, isAdmin } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { NotificationService } from "@/features/notifications/services/notification.service";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  const notifications = await NotificationService.getForUser(user.id);
  return api.success(notifications);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  // Only SUPERADMIN can send notifications manually via this route
  if (!isAdmin(user.role)) {
    throw new ForbiddenError("Only admins can send notifications");
  }

  const body = await req.json();
  const { title, message, type, href, targetUserId, broadcast } = body;

  if (!title || !message) {
    throw new ValidationError("Title and Message are required");
  }

  if (!broadcast && !targetUserId) {
    throw new ValidationError("Provide targetUserId or broadcast=true");
  }

  const result = await NotificationService.dispatch({
    title,
    message,
    type,
    href,
    targetUserId,
    broadcast,
    request: req,
  });

  return api.success(result, "Notification dispatched successfully");
});
