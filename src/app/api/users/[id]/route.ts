import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, isAdmin } from "@/features/auth/server/api-auth";
import bcrypt from "bcryptjs";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";

export const PATCH = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getAuthenticatedUser(request);

  // Only SUPERADMIN can update users
  if (!user || !isAdmin(user.role)) {
    throw new ForbiddenError("Insufficient permissions");
  }

  const { id } = await params;

  const body = await request.json();
  const { name, email, password, role } = body;

  const updateData: Record<string, unknown> = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return api.success(updatedUser, "User updated successfully");
  } catch (error) {
    // If user not found
    if ((error as any).code === 'P2025') {
      throw new NotFoundError("User not found");
    }
    throw error;
  }
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await getAuthenticatedUser(request);

  // Only SUPERADMIN can delete users
  if (!user || !isAdmin(user.role)) {
    throw new ForbiddenError("Insufficient permissions");
  }

  const { id } = await params;

  if (id === user.id) {
    throw new ValidationError("Cannot delete yourself");
  }

  try {
    await prisma.user.delete({ where: { id } });
    return api.success(null, "User deleted successfully");
  } catch (error) {
    // If user not found
    if ((error as any).code === 'P2025') {
      throw new NotFoundError("User not found");
    }
    throw error;
  }
});

