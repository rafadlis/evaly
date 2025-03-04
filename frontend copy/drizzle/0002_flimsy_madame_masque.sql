CREATE TABLE `organization` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo_url` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `organization_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizer` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`level` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `organizer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `organizer` ADD CONSTRAINT `organizer_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organizer` ADD CONSTRAINT `organizer_organization_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `organization` (`id`);--> statement-breakpoint
CREATE INDEX `organizer_id_idx` ON `organizer` (`id`);