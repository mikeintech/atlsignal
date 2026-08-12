CREATE TABLE `newsroom_contacts` (
	`contact_id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`contact_type` text NOT NULL,
	`message` text NOT NULL,
	`page_url` text,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` integer NOT NULL
);
