import { drizzle } from "drizzle-orm/libsql";

declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
}

export const db =
  globalThis._db ||
  drizzle({
    connection: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._db = db;
}
