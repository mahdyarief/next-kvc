import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { RegisterService } from "@/features/auth/services/register.service";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  challengeCode: z.string().min(1),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, challengeCode } = verifySchema.parse(body);

  const activatedUser = await RegisterService.verify(email, challengeCode);

  return api.success(
    activatedUser,
    "Your account is now active. Welcome abroad!"
  );
});
