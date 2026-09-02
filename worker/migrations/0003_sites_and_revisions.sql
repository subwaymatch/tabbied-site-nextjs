CREATE TABLE `revision` (
	`id` text PRIMARY KEY NOT NULL,
	`site_id` text NOT NULL,
	`n` integer NOT NULL,
	`edits` text NOT NULL,
	`instruction` text,
	`source` text NOT NULL,
	`model` text NOT NULL,
	`response_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `site`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `revision_site_n_idx` ON `revision` (`site_id`,`n`);--> statement-breakpoint
CREATE TABLE `site` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`generation_id` text NOT NULL,
	`direction_index` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`spec_version` integer NOT NULL,
	`template_hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`generation_id`) REFERENCES `generation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `site_user_updated_idx` ON `site` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `site_generation_idx` ON `site` (`generation_id`);