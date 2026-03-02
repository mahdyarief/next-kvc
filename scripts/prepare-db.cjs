const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const configPath = path.join(__dirname, "..", "prisma.config.ts");
const schemaDir = path.join(__dirname, "..", "prisma", "schema");

let dbUrl = process.env.DATABASE_URL;

// Parse .env if available
if (!dbUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^DATABASE_URL=(.*)$/m);
  if (match) {
    dbUrl = match[1].replace(/['"]/g, "").trim();
  }
}

// Determine provider type
let provider = "sqlite";
if (dbUrl && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
  provider = "postgresql";
}

// Build the database URL expression for prisma.config.ts
let urlExpression;
if (provider === "postgresql") {
  urlExpression = `process.env.DATABASE_URL || ""`;
  console.log("🔄 Detected PostgreSQL connection string. Configuring Prisma for PostgreSQL...");
} else {
  const sqliteFallback = `\`file:\${path.join(process.cwd(), "prisma", "local.db")}\``;
  urlExpression = `process.env.DATABASE_URL || ${sqliteFallback}`;
  console.log(
    "🔄 Detected SQLite or no connection string. Hardcoding Prisma for SQLite (file:./local.db)..."
  );
}

// Generate prisma.config.ts content
const configContent = `import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Resolve the DATABASE_URL at config time.
// Priority: environment variable > SQLite fallback
const databaseUrl = ${urlExpression};

export default defineConfig({
  // In v7, 'schema' points to the folder or the single file
  schema: "./prisma/schema",
  datasource: {
    url: databaseUrl,
  },
});
`;

if (!fs.existsSync(schemaDir)) {
  console.error(`❌ Prisma schema folder not found at ${schemaDir}`);
  process.exit(1);
}

// Write prisma.config.ts
const existingConfig = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
if (existingConfig === configContent) {
  console.log(`✅ [prepare-db] Prisma config is already correctly configured for '${provider}'.`);
} else {
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ [prepare-db] prisma.config.ts updated to use '${provider}' provider.`);
}
