import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/features/auth/server/api-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError, ValidationError } from "@/lib/errors";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SUPERADMIN", "ADMIN", "STAFF", "CUSTOMER"]).default("CUSTOMER"),
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  const user = await getAuthenticatedUser(request);

  if (!user || !isAdmin(user.role)) {
    throw new ForbiddenError("Insufficient permissions");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return api.success(users);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const user = await getAuthenticatedUser(request);

  if (!user || !isAdmin(user.role)) {
    throw new ForbiddenError("Insufficient permissions");
  }

  const body = await request.json();
  const parseResult = createUserSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError("Invalid request data");
  }

  const { name, email, password, role } = parseResult.data;

  // Check if email exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return api.error("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return api.success(newUser, "User created successfully");
});

