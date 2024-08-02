import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import bodyParser from "body-parser";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { webhookController } from "./routers/webhookController";
import { Elysia, t } from "elysia";
import mysql from "mysql2/promise";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { createServer } from "http";

const PORT = process.env.PORT || 4005;

const appRouter = createTRPCRouter({
  user: userRouter,
  // webhook: clerkWebhook,
});

const expressApp = express();

expressApp.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => webhookController(req, res)
);

expressApp.post("/api/user.publicmetadata", async (req, res) => {
  const { data, userId } = await req.body.json();

  const { bio } = data as UserMetadata;
  const updateFields = { bio };

  let toUpdate: [string, string | boolean][] = [];

  Object.entries(updateFields).forEach((field) => {
    if (field !== undefined) {
      toUpdate.push(field);
    }
  });

  if (Object.keys(toUpdate).length === 0) {
    return { error: "No fields to update", statusCode: "404" };
  }

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      bio: bio,
    },
  });
  res.status(200).json({ success: true });
});

const MYSQL_DBHOST = process.env.MYSQL_DBHOST;
const MYSQL_DBUSER = process.env.MYSQL_DBUSER;
const MYSQL_DBPASS = process.env.MYSQL_DBPASS;
const MYSQL_DBDATABASE = process.env.MYSQL_DBDATABASE;

const dbConfig = {
  host: MYSQL_DBHOST,
  user: MYSQL_DBUSER,
  password: MYSQL_DBPASS,
  database: MYSQL_DBDATABASE,
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Ensure uploads directory exists
const uploadsDir = "./uploads";
await mkdir(uploadsDir, { recursive: true });

await pool.query(`
  CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

const elysiaApp = new Elysia()
  .post(
    "/upload",
    async ({ body }) => {
      const { file } = body;

      console.log(file);
      if (!file) throw new Error("No file uploaded");

      const id = randomUUID();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${id}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);

      await writeFile(filePath, new Uint8Array(await file.arrayBuffer()));

      console.log("WRITE COMPLETE");

      await pool.query(
        "INSERT INTO files (id, name, mime_type, file_path) VALUES (?, ?, ?, ?)",
        [id, file.name, file.type, filePath]
      );
      console.log("UPLOAD COMPLETE");

      return { id, name: file.name, type: file.type };
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  )
  .get("/file/:id", async ({ params }) => {
    const [rows] = await pool.query("SELECT * FROM files WHERE id = ?", [
      params.id,
    ]);
    const file = rows[0] as any;

    if (!file) throw new Error("File not found");

    return new Response(Bun.file(file.file_path), {
      headers: { "Content-Type": file.mime_type },
    });
  });

expressApp.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

expressApp.use(elysiaApp.handle);

// Create a combined server
const server = createServer((req, res) => {
  expressApp(req, res); // Pass requests to Express app
});

// Handle Elysia routes

server.listen(PORT, () => {
  console.log(`✅  [SERVER RUNNING] 🔌 on port ${PORT}`);
});
