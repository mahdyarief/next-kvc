import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { RegisterService } from "@/features/auth/services/register.service";
import { registerSchema } from "@/features/auth/constants";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const input = registerSchema.parse(body);

  const result = await RegisterService.start(input);

  return api.success(
    result,
    "Registration started. Please secure your recovery codes."
  );
});

