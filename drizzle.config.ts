import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_SQLITE_URL!,
    authToken: process.env.TURSO_AUTHKEY!,
  },
  tablesFilter: ["asterisk_mapp_"],
});
