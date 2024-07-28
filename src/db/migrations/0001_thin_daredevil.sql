ALTER TABLE `EXPO__users` RENAME TO `asterisk_mapp_users`;--> statement-breakpoint
DROP INDEX IF EXISTS `EXPO__users_username_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `EXPO__users_email_unique`;--> statement-breakpoint
ALTER TABLE `asterisk_mapp_users` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `asterisk_mapp_users_username_unique` ON `asterisk_mapp_users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `asterisk_mapp_users_email_unique` ON `asterisk_mapp_users` (`email`);