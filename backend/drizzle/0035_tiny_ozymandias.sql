ALTER TABLE "llm_message" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "llm_message" ALTER COLUMN "message" SET NOT NULL;