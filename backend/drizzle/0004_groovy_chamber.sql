DROP TABLE "question_option" CASCADE;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "options" jsonb;