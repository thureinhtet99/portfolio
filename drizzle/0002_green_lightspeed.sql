ALTER TABLE `project` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `project_slug_unique` ON `project` (`slug`);--> statement-breakpoint
ALTER TABLE `work` DROP COLUMN `is_current_employer`;