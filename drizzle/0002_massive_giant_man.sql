CREATE TABLE `content_analytics` (
	`analytics_id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`path` text NOT NULL,
	`target` text,
	`created_at` integer NOT NULL
);
