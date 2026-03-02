import { put, del as delBlob, type PutBlobResult } from "@vercel/blob";
import { UTApi } from "uploadthing/server";
import fs from "node:fs/promises";
import path from "node:path";

export interface UploadResult {
  url: string;
  pathname: string;
  contentType?: string;
}

const utapi = new UTApi();

export class StorageService {
  private static provider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();

  /**
   * Upload a file to the active storage provider.
   */
  static async upload(
    filename: string,
    file: Buffer | Blob | File,
    options: { contentType?: string; access?: "public" | "private" } = {}
  ): Promise<UploadResult> {
    if (this.provider === "vercel-blob") {
      const result: PutBlobResult = await put(filename, file, {
        access: options.access || "public",
        contentType: options.contentType,
      });
      return {
        url: result.url,
        pathname: result.pathname,
        contentType: result.contentType,
      };
    }

    if (this.provider === "uploadthing") {
      let fileToUpload: File;
      
      if (file instanceof File) {
        fileToUpload = file;
      } else {
        // cast to any to satisfy Blob constructor which expects BlobPart
        const blobPart = file as unknown as BlobPart;
        fileToUpload = new File([blobPart], filename, { type: options.contentType });
      }
      
      const response = await utapi.uploadFiles(fileToUpload);
      
      if (response.error) {
        throw new Error(`UploadThing Error: ${response.error.message}`);
      }

      return {
        url: response.data.url,
        pathname: response.data.key,
        contentType: options.contentType,
      };
    }

    // Local Fallback (Development)
    return this.uploadLocal(filename, file);
  }

  /**
   * Delete a file from the active storage provider.
   */
  static async delete(url: string): Promise<void> {
    if (this.provider === "vercel-blob") {
      await delBlob(url);
      return;
    }

    if (this.provider === "uploadthing") {
      // For UploadThing, the "url" is usually passed, but it needs the key
      // If we store the key in 'pathname', we should use that.
      // But for simplicity in a unified service, we might need to extract key from URL if not provided.
      const key = url.split("/").pop(); // Basic key extraction
      if (key) await utapi.deleteFiles(key);
      return;
    }

    // Local Fallback (Development)
    await this.deleteLocal(url);
  }

  private static async uploadLocal(filename: string, file: Buffer | Blob | File): Promise<UploadResult> {
    const publicDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(publicDir, { recursive: true });

    // Ensure safe filename
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(publicDir, safeName);

    if (file instanceof Buffer) {
      await fs.writeFile(filePath, file);
    } else {
      const data = file as unknown as Blob;
      const arrayBuffer = await data.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    }

    const url = `/uploads/${safeName}`;
    return {
      url,
      pathname: safeName,
    };
  }

  private static async deleteLocal(url: string): Promise<void> {
    if (!url.startsWith("/uploads/")) return;
    
    const filename = url.replace("/uploads/", "");
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`[StorageService] Failed to delete local file: ${filePath}`, err);
    }
  }
}
