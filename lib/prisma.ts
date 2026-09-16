import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Prisma 7 talks to Postgres through a driver adapter rather than the old
 * Rust engine, so the client is constructed with `PrismaPg` here. The
 * connection string is read once, at module load.
 *
 * This module is server-only: the generated client imports `node:process`,
 * `node:path` and `node:url`, so importing it from a client component fails
 * the build rather than leaking a connection string to the browser.
 */

const connectionString = process.env.DATABASE_URL;

function createPrismaClient() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and point it at a PostgreSQL database before using the database layer.",
    );
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

/**
 * Next dev server reloads modules on every edit; without this cache each
 * reload would open a new pool until Postgres refuses connections.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientSingleton;
};

export const prisma: PrismaClientSingleton =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
