-- ALTER TABLE "llm_message" ALTER COLUMN "message" SET DATA TYPE jsonb;--> statement-breakpoint
-- ALTER TABLE "llm_message" ALTER COLUMN "message" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "llm_message" DROP COLUMN "attachments";--> statement-breakpoint
ALTER TABLE "llm_message" DROP COLUMN "role";