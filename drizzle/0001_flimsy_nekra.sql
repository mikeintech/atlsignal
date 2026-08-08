CREATE TABLE `editorial_review_decisions` (
	`decision_id` text PRIMARY KEY NOT NULL,
	`candidate_id` text NOT NULL,
	`reviewer_email` text NOT NULL,
	`decision` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL
);
