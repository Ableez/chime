import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: "@/.env" });

if (!process.env["TURSO_SQLITE_URL"] || !process.env["TURSO_AUTHKEY"]) {
  throw new Error("❌Database credentials not provided");
}

const client = createClient({
  url: process.env.TURSO_SQLITE_URL,
  authToken: process.env.TURSO_AUTHKEY,
});

export const db = drizzle(client, { schema: schema });
