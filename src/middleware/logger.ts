import { t } from "../api/trpc";
import { logger } from "../logs/logger";

export const loggerMiddleware = t.middleware(
  async ({ next, type, path, ctx }) => {
    const start = Date.now();

    logger({
      title: type,
      logEntry: `${start}\n[tRPC]\t${type}\tto\t${path}\n\n`,
    });

    const result = await next();
    return result;
  }
);
