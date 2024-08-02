import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  Webhook,
  type WebhookRequiredHeaders,
  WebhookVerificationError,
} from "svix";
import { createTRPCRouter, publicProcedure } from "@/trpc";
import { config } from "dotenv";

config({ path: "../.env" });

export const clerkWebhook = createTRPCRouter({
  clerk: publicProcedure
    .input(
      z.object({
        body: z.unknown(),
        headers: z.object({
          "svix-id": z.string(),
          "svix-timestamp": z.string(),
          "svix-signature": z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
      if (!WEBHOOK_SECRET) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "WEBHOOK_SECRET is not set in environment variables",
        });
      }

      const wh = new Webhook(WEBHOOK_SECRET);

      let evt: {
        id: string;
        type: string;
        data: Record<string, unknown>;
      };

      try {
        evt = wh.verify(
          JSON.stringify(input.body),
          input.headers as WebhookRequiredHeaders
        ) as any;
      } catch (err) {
        console.error(
          "Error verifying webhook:",
          (err as WebhookVerificationError).message
        );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (err as WebhookVerificationError).message,
        });
      }

      const { id, type, data } = evt;
      console.log(`Webhook with an ID of ${id} and type of ${type}`);
      console.log("Webhook body:", data);

      return {
        success: true,
        message: "Webhook received",
      };
    }),
});
