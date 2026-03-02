import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";
import { ProfileService } from "@/features/profile/services/profile.service";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  const profile = await ProfileService.getProfile(user.id);
  return api.success(profile);
});

export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  const body = await req.json();
  const updated = await ProfileService.updateProfile(user.id, body, req);

  return api.success(updated, "Profile updated successfully");
});
