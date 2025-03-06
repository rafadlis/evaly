ALTER TABLE "question" ADD COLUMN "reference_type" varchar(100) DEFAULT 'test-session' NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "organization_id" varchar(255);