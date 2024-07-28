import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";

const PORT = process.env.PORT || 4006;

const appRouter = createTRPCRouter({
  user: userRouter,
});

const app = express();

console.log("APP");

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(PORT, () => console.log("✅  [SERVER RUNNING] 🔌", PORT));
