import { PrismaClient } from "../generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool as PgPool } from "pg";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Ensure DATABASE_URL is set before client instantiation
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/local.db";
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/local.db";
  console.log(`📡 Prisma connecting to: ${dbUrl}`);

  let adapter;
  
  // 1. SQLite Verification
  if (dbUrl.includes(".db") || dbUrl.startsWith("file:")) {
    adapter = new PrismaBetterSqlite3({ url: dbUrl });
  } 
  // 2. PostgreSQL Verification
  else if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    const pool = new PgPool({ connectionString: dbUrl });
    adapter = new PrismaPg(pool);
  } 
  // 3. MySQL / MariaDB Verification
  else if (dbUrl.startsWith("mysql://") || dbUrl.startsWith("mariadb://")) {
    // PrismaMariaDb expects the connection string or PoolConfig object directly
    adapter = new PrismaMariaDb(dbUrl);
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: adapter as any,
  });
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "../generated/client";
