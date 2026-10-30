CREATE TABLE `chat_unanswered` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`page` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_usage` (
	`day` text PRIMARY KEY NOT NULL,
	`requests` integer DEFAULT 0 NOT NULL,
	`input_tokens` integer DEFAULT 0 NOT NULL,
	`output_tokens` integer DEFAULT 0 NOT NULL,
	`cost_micro_usd` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
