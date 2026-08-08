CREATE TABLE `newsletter_subscribers` (
	`subscriber_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`market_id` text NOT NULL,
	`source` text NOT NULL,
	`consent_version` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `newsletter_sync_events` (
	`sync_event_id` text PRIMARY KEY NOT NULL,
	`subscriber_id` text NOT NULL,
	`provider` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL
);
