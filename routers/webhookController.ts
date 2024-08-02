import { db } from "@/src/db/db";
import { users } from "@/src/db/schema";
import { config } from "dotenv";
import { eq, type SQL } from "drizzle-orm";
import {
  Webhook,
  type IncomingWebhookPayloadOut,
  type WebhookRequiredHeaders,
  type WebhookVerificationError,
} from "svix";

config({ path: "../.env" });

type UserFields = {
  birthday: string;
  first_name: string;
  gender: string;
  username: string;
  profile_image_url: string;
  last_name: string;
};

export const webhookController = async function (req: Request, res: Response) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("You need a WEBHOOK_SECRET in your .env");
  }

  const payload = req.body;
  const headers = req.headers;

  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: "Error occurred -- no svix headers",
    });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkWebhook;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    } as WebhookRequiredHeaders) as IncomingWebhookPayloadOut;
  } catch (err) {
    console.log(
      "Error verifying webhook:",
      (err as WebhookVerificationError).message
    );
    return res.status(400).json({
      success: false,
      message: (err as WebhookVerificationError).message,
    });
  }

  const { data } = evt;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${data.id} and type of ${eventType}`);
  console.log("Webhook body:", evt);

  if (evt.type === "user.created") {
    try {
      await db.insert(users).values({
        id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address as string,
        username: evt.data.username,
      });

      return res.status(200).json({
        success: true,
        message: "User account created",
      });
    } catch (error) {
      console.error("[DB ERROR]", error);
      return res.status(500).json({
        message: "Internal error occured while saving user data to database",
        success: false,
      });
    }
  }

  if (evt.type === "user.update") {
    try {
      const {
        birthday,
        first_name,
        gender,
        username,
        profile_image_url,
        last_name,
        id,
      } = evt.data;

      const upadateFields = {
        birthday,
        firstName: first_name,
        gender,
        username,
        profilePicture: profile_image_url,
        lastName: last_name,
      };

      let toUpdate: [];

      Object.entries(upadateFields).forEach((field) => {
        if (field !== undefined) {
          toUpdate.push(field);
        }
      });

      if (Object.keys(toUpdate).length === 0) {
        console.log({ error: "No fields to update", statusCode: "404" });
        return { error: "No fields to update", statusCode: "404" };
      }

      await db
        .update(users)
        .set(Object.fromEntries(toUpdate))
        .where(eq(users.id, id));
      console.log({ message: "User updated", statusCode: "200" });
    } catch (error) {
      console.error("[DB ERROR]", error);
      return res.status(500).json({
        message: "Internal error occured while saving user data to database",
        success: false,
      });
    }
  }
};
