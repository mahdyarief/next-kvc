import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/features/auth/server/api-auth";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError } from "@/lib/errors";

export const GET = withErrorHandler(async () => {
  const config = await prisma.systemConfig.findUnique({
    where: { id: "default" },
  });

  return api.success(config || { appName: "NEXT-KVC" });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user || user.role !== "SUPERADMIN") {
    throw new ForbiddenError("Insufficient permissions");
  }

  const body = await req.json();
  const { appName, logoUrl, timezone, enableRegistration } = body;

  const config = await prisma.systemConfig.upsert({
    where: { id: "default" },
    update: { appName, logoUrl, timezone, enableRegistration: enableRegistration ?? true },
    create: {
      id: "default",
      appName,
      logoUrl: logoUrl || "",
      timezone: timezone || "Asia/Jakarta",
      enableRegistration: enableRegistration ?? true,
    },
  });

  return api.success(config, "System configuration updated");
});

