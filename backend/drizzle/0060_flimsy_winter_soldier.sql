ALTER TABLE "llm_message" ADD COLUMN "title" varchar(255);--> statement-breakpoint
ALTER TABLE "llm_message" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;