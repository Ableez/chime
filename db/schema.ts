import {
  text,
  integer,
  blob,
  sqliteTableCreator,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { v5 } from "uuid";

type ArrStr = string[];

const createTable = sqliteTableCreator((name) => `EXPO__${name}`);

const ns = "a3853a1d-17a2-47c4-89ee-3abcf286483d";

export const users = createTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => v5("asterisk_userId", ns)),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstname: text("firstname"),
  lastname: text("lastname"),
  createdAt: text("created_at")
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

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  following: many(follows, { relationName: "followerId" }),
  followers: many(follows, { relationName: "followingId" }),
  media: many(media),
}));

export const follows = createTable("follows", {
  followerId: text("follower_id")
    .notNull()
    .references(() => users.id),
  followingId: text("following_id")
    .notNull()
    .references(() => users.id),
});

export const posts = createTable("post", {
  id: text("id")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  likes: blob("likes", { mode: "json" }).$type<
    { userId: string; likedAt: string; status: "Like" | "Dislike" }[]
  >(),
  commentDisabled: integer("comment_disabled", { mode: "boolean" }).default(
    false
  ),
  captionText: text("caption_text"),
  captionEditted: integer("caption_editted", { mode: "boolean" }),
  captionAvailable: integer("caption_available", { mode: "boolean" }).notNull(),
  captionCreatedAt: text("caption_created_at").default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  captionEdittedAt: text("caption_editted_at").default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  isPostUnavailable: integer("is_post_unavailable", {
    mode: "boolean",
  }).notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  media: many(media),
}));

export const media = createTable("media", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  originalHeight: integer("original_height").notNull(),
  originalWidth: integer("original_width").notNull(),
  sourceUrl: text("source_url").notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(posts, { fields: [media.postId], references: [posts.id] }),
  user: one(users, { fields: [media.userId], references: [users.id] }),
}));

// export const postHashTags = createTable("post_hash_tags", {
//   postId: text("post_id")
//     .notNull()
//     .references(() => posts.id),
//   hashTag: text("hash_tag").notNull(),
// });

// export const postTags = createTable("post_tags", {
//   postId: text("post_id")
//     .notNull()
//     .references(() => posts.id),
//   tag: text("tag").notNull(),
// });

// export const captionPrevVersions = createTable("caption_prev_versions", {
//   postId: text("post_id")
//     .notNull()
//     .references(() => posts.id),
//   version: integer("version").notNull(),
//   content: text("content").notNull(),
// });

// export const userChats = createTable("user_chats", {
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id),
//   chatId: text("chat_id").notNull(),
// });

// export const stories = createTable("stories", {
//   id: text("id").primaryKey(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id),
//   content: blob("content").notNull(),
// });

// export const reels = createTable("reels", {
//   id: text("id").primaryKey(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id),
//   content: blob("content").notNull(),
// });

// export const userNotifications = createTable("user_notifications", {
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id),
//   notificationId: text("notification_id").notNull(),
//   seen: integer("seen", { mode: "boolean" }).notNull(),
// });
