import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
}

const sql = neon(process.env.DATABASE_URL!);

export const db = globalThis._db || drizzle({ client: sql });

if (process.env.NODE_ENV !== "production") {
  globalThis._db = db;
}
