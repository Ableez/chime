import { createClerkClient } from "@clerk/backend";
import { config } from "dotenv";

config({ path: "./.env" });

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  apiUrl: process.env.CLERK_API_URL,
  jwtKey: process.env.CLERK_JWK_PEM,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  telemetry: {
    debug: process.env.NODE_ENV! === "development",
    disabled: process.env.NODE_ENV! === "development",
  },
});
