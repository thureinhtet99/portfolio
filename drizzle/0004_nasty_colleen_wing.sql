CREATE TABLE `timeline` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`description` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `work_experience` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`company_logo` text,
	`company_website` text,
	`positions` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `education`;--> statement-breakpoint
DROP TABLE `work`;--> statement-breakpoint
DROP TABLE `milestone`;