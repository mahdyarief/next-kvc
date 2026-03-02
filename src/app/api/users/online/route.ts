import { getAuthenticatedUser, isAdmin } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

/**
 * [GET] /api/users/online
 * Returns a list of user IDs currently connected via Socket.io
 */
export const GET = withErrorHandler(async (req) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  // Only admins can see who's currently online
  if (!isAdmin(user.role)) {
    throw new ForbiddenError("Only admins can view online status");
  }

  // Get the global io instance
  const io = (globalThis as unknown as { io: { getOnlineUsers?: () => string[] } }).io;
  if (!io || typeof io.getOnlineUsers !== "function") {
    return api.success([], "Online tracking not initialized");
  }

  const onlineUserIds = io.getOnlineUsers();
  return api.success(onlineUserIds);
});
