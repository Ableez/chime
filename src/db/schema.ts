import { text, integer, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v5 } from "uuid";

const createTable = sqliteTableCreator((name) => `asterisk_mapp_${name}`);

const ns = "a3853a1d-17a2-47c4-89ee-3abcf286483d";

export const users = createTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => v5("asterisk_userId", ns)),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  firstname: text("firstname"),
  lastname: text("lastname"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  image_url: text("image_url"),
  bio: text("bio"),
  hasActiveStories: integer("has_active_stories", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  unreadMessages: integer("unread_messages"),
  profilePicture: text("profile_picture"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
});
