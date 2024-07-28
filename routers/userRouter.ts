import { db } from "@/src/db/db";
import { users } from "@/src/db/schema";
import { createTRPCRouter, publicProcedure } from "@/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

type UserFields = {
  email: string;
  username: string;
  phoneNumber: string;
  firstname: string;
  lastname: string;
  profilePicture: string;
  emailVerified: boolean;
};

type PartialUserFields = Partial<UserFields>;

export const userRouter = createTRPCRouter({
  getUser: publicProcedure.query(() => {
    return { id: "wassup", name: "Bilbo" };
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
      try {
        await db.insert(users).values({
          username: input.username,
          id: input.userId,
          email: input.email,
        });

        return { message: "User created successfully", stausCode: "200" };
      } catch (error) {
        console.error(error);
        return {
          error: "Something went wrong, please try again.",
          stausCode: "500",
          errorData: error,
        };
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
});
