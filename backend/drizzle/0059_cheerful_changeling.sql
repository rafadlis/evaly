ALTER TABLE "llm_message" ADD COLUMN "completition_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "llm_message" ADD COLUMN "prompt_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "llm_message" ADD COLUMN "total_tokens" integer DEFAULT 0 NOT NULL;