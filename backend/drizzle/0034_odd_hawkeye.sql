ALTER TABLE "llm_message" ADD COLUMN "attachments" jsonb;--> statement-breakpoint
ALTER TABLE "llm_message" ADD COLUMN "role" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "llm_message" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "llm_message" DROP COLUMN "updated_at";