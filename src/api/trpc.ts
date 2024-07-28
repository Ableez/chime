// import { initTRPC } from "@trpc/server";
// import { ZodError } from "zod";
// import { db } from "../db/db";
// import SuperJSON from "superjson";
// import { timingMiddleware } from "../middleware/timer";
// import { loggerMiddleware } from "../middleware/logger";

// // export const createTRPCContext = async (opts: Request) => {
// //   return {
// //     db,
// //     ...opts,
// //   };
// // };

// export const t = initTRPC.create({
//   transformer: SuperJSON,
//   errorFormatter({ shape, error }) {
//     return {
//       ...shape,
//       data: {
//         ...shape.data,
//         zodError:
//           error.cause instanceof ZodError ? error.cause.flatten() : null,
//       },
//     };
//   },
// });

// export const publicProcedure = t.procedure
//   .use(timingMiddleware)
//   .use(loggerMiddleware);

// // export const protectedProcedure = t.procedure
// //   .use(timingMiddleware)
// //   .use(loggerMiddleware)
// //   .use(async ({ ctx, next }) => {
// //     const isAuthed = await clerkClient.authenticateRequest(ctx);

// //     if (!isAuthed || !isAuthed.isSignedIn) {
// //       throw new TRPCError({ code: "UNAUTHORIZED" });
// //     }

// //     return next({
// //       ctx: {
// //         Headers: isAuthed.headers,
// //       },
// //     });
// //   });

// export const createTRPCRouter = t.router;
