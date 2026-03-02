import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Resolve the DATABASE_URL at config time.
// Priority: environment variable > SQLite fallback
const databaseUrl = process.env.DATABASE_URL || "";

export default defineConfig({
  // In v7, 'schema' points to the folder or the single file
  schema: "./prisma/schema",
  datasource: {
    url: databaseUrl,
  },
});
