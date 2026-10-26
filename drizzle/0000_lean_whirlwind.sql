CREATE TABLE `answer_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`responder_name` text DEFAULT 'ยู' NOT NULL,
	`answers_json` text NOT NULL,
	`consent_version` text DEFAULT 'v1' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
