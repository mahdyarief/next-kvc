import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    "better-sqlite3",
    "sharp",
    "bcryptjs",
    "@prisma/client",
    ".prisma/client",
    "node:crypto",
    "node:buffer",
  ],
};

export default nextConfig;
