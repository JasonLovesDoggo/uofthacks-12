import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

declare global {
  var _db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const sql = neon(process.env.DATABASE_URL!);

export const db = globalThis._db || drizzle({ client: sql, schema });

if (process.env.NODE_ENV !== "production") {
  globalThis._db = db;
}
