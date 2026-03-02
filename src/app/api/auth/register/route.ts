import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { RegisterService } from "@/features/auth/services/register.service";
import { registerSchema } from "@/features/auth/constants";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const input = registerSchema.parse(body);

  const newUser = await RegisterService.execute(input);

  return api.success(
    { id: newUser.id, name: newUser.name, email: newUser.email },
    "User registered successfully"
  );
});

