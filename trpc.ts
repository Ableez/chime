import { initTRPC } from "@trpc/server";

// const createContext = ({
//   req,
//   res,
// }: trpcExpress.CreateExpressContextOptions) => ({}); // no context

// type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
