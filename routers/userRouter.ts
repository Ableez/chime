import { db } from "@/src/db/db";
import { users } from "@/src/db/schema";
import { createTRPCRouter, publicProcedure } from "@/trpc";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  updatePublicMetadata: publicProcedure
    .input(z.object({ userId: z.string(), data: z.unknown() }))
    .query(async ({ input }) => {
      try {
        console.log("[INP]", input);
        const { data } = input;

        const { bio } = data as UserMetadata;
        const updateFields = { bio };

        let toUpdate: [string, string][] = [];

        Object.entries(updateFields).forEach((field) => {
          if (field !== undefined) {
            toUpdate.push(field);
          }
        });

        if (Object.keys(toUpdate).length === 0) {
          return { error: "No fields to update", statusCode: "404" };
        }

        try {
          await clerkClient.users.updateUserMetadata(input.userId, {
            publicMetadata: {
              bio: bio,
            },
          });

          await db
            .update(users)
            .set(Object.fromEntries(toUpdate))
            .where(eq(users.id, input.userId));

          return { message: "User updated successfully", statusCode: "200" };
        } catch (error) {
          console.error("[USER.UPDATEPUBLICMETADATA]", error);
          return {
            error: "Could not update user on Database",
            statusCode: "500",
          };
        }
      } catch (error) {
        console.error(error);
        return { error: "Internal server error", statusCode: "500" };
      }
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        email: z.string().optional(),
        username: z.string().optional(),
        phoneNumber: z.string().optional(),
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        profilePicture: z.string().optional(),
        emailVerified: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, ...updateFields } = input;

      if (!userId) {
        return { error: "userId field not passed", statusCode: "400" };
      }

      const userToUpdate = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!userToUpdate) {
        return { error: "User not found", statusCode: "404" };
      }

      let toUpdate: [string, string | boolean][] = [];

      Object.entries(updateFields).forEach((field) => {
        if (field !== undefined) {
          toUpdate.push(field);
        }
      });

      if (Object.keys(toUpdate).length === 0) {
        return { error: "No fields to update", statusCode: "404" };
      }

      try {
        await db
          .update(users)
          .set(Object.fromEntries(toUpdate))
          .where(eq(users.id, userId));

        return { message: "User updated successfully", statusCode: "200" };
      } catch (error) {
        console.error("[USER.UPDATEERROR]", error);
        return {
          error: "Could not update user on Database",
          statusCode: "500",
        };
      }
    }),
    
  updateUserPublicMetadata: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        data: z.object({
          profilePicture: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      console.log("UPDATING PUBLIC METADATA");
      const { userId, data } = input;
      if (!userId) {
        return { error: "userId field not passed", statusCode: "400" };
      }

      const userToUpdate = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!userToUpdate) {
        console.log({ error: "User not found", statusCode: "404" });
        return { error: "User not found", statusCode: "404" };
      }

      console.log(input.data.profilePicture);

      const toUpdate = Object.entries(data).filter(
        ([_, value]) => value !== undefined
      );

      console.log("TO UPDATE", toUpdate);

      if (toUpdate.length === 0) {
        console.log({ error: "No fields to update", statusCode: "404" });
        return { error: "No fields to update", statusCode: "404" };
      }

      try {
        console.log("CHECKS PASSED UPDATING ON CLERK");
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: Object.fromEntries(toUpdate),
        });
        console.log("CLERK COMPLETED");

        console.log("DB UPDATING");
        await db
          .update(users)
          .set(Object.fromEntries(toUpdate))
          .where(eq(users.id, userId));
        console.log("DB UPDATED");

        return {
          message: "User public metadata updated successfully",
          statusCode: "200",
        };
      } catch (error) {
        console.error(error);
        return {
          error: "An error occurred while updating user metadata",
          statusCode: "500",
        };
      }
    }),
});
