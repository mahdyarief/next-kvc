import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { StorageService } from "@/features/storage/services/storage.service";
import { getAuthenticatedUser } from "@/features/auth/server/api-auth";
import { UnauthorizedError, ValidationError } from "@/lib/errors";

/**
 * @swagger
 * /api/storage/upload:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the active storage provider (Local or Vercel Blob)
 *     tags: [Storage]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new UnauthorizedError();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    throw new ValidationError("No file provided");
  }

  // Basic security: Limit file size (e.g., 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new ValidationError("File size exceeds 5MB limit");
  }

  const result = await StorageService.upload(file.name, file, {
    contentType: file.type,
  });

  return api.success(result, "File uploaded successfully");
});
