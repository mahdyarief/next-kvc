import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ResetService } from "@/features/auth/services/reset.service";
import { forgetPasswordSchema } from "@/features/auth/constants";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const input = forgetPasswordSchema.parse(body);

  const updatedUser = await ResetService.execute(input);

  return api.success(
    updatedUser,
    "Your password has been successfully reset. Redirecting to login..."
  );
});
