import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError } from "@/lib/errors";
import { SettingsService } from "@/features/settings/services/settings.service";

export const GET = withErrorHandler(async () => {
  const config = await SettingsService.getConfig();
  return api.success(config);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user || user.role !== "SUPERADMIN") {
    throw new ForbiddenError("Insufficient permissions");
  }

  const body = await req.json();
  const config = await SettingsService.updateConfig(body, req);

  return api.success(config, "System configuration updated");
});
