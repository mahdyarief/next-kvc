import { getAuthenticatedUser } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";

/**
 * [GET] /api/user
 * Returns the currently authenticated user's profile
 */
export const GET = withErrorHandler(async (req) => {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return api.error("Unauthorized", 401);
  }

  // Sanitize user object (e.g., exclude password if it were there)
  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return api.success(profile);
});
