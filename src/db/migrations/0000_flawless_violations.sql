CREATE TABLE `EXPO__users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`firstname` text,
	`lastname` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`image_url` text,
	`bio` text,
	`has_active_stories` integer DEFAULT false NOT NULL,
	`unread_messages` integer,
	`profile_picture` text,
	`email_verified` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `EXPO__users_username_unique` ON `EXPO__users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `EXPO__users_email_unique` ON `EXPO__users` (`email`);