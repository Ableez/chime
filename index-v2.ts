import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { createServer } from "http";
import SuperJSON from "superjson";
import { initTRPC } from "@trpc/server";
import { z, ZodError } from "zod";
import { db } from "./src/db/db";
import { users } from "./src/db/schema";

const t = initTRPC.create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const publicProcedure = t.procedure;

const createTRPCRouter = t.router;

const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query((opts) => {
      return { id: opts.input, name: "Bilbo" };
    }),
  createUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(users).values({
        username: input.username,
        id: input.userId,
        email: input.email,
      });
    }),
});

const appRouter = createTRPCRouter({
  user: userRouter,
});

//  type definition of API
// type AppRouter = typeof appRouter;

createServer((_req, res) => {
  /**
   * Handle the request however you like,
   * just call the tRPC handler when you're ready
   */
  console.log(res.req.method, "[REQUEST] received");
  createHTTPHandler({
    router: appRouter,
    createContext: () => {
      return {};
    },
  });
}).listen(4005);
