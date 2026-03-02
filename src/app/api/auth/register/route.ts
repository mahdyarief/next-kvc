import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError } from "@/lib/errors";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password, name } = registerSchema.parse(body);

  // Check if registration is enabled
  const systemConfig = await prisma.systemConfig.findUnique({ where: { id: "default" } });
  if (systemConfig && systemConfig.enableRegistration === false) {
    throw new ForbiddenError("Registration is currently disabled by the administrator");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return api.error("User with this email already exists", 400);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return api.success(
    { id: newUser.id, name: newUser.name, email: newUser.email },
    "User registered successfully"
  );
});

