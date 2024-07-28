import { type Config } from "drizzle-kit";

export default {
  schema: "./db/remote-schema.ts",
  out: "./db/remote-drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["asterisk_mapp_*"],
} satisfies Config;
