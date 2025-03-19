ALTER TABLE "question_template" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "question_template" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "question_template" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "test_attempt" ALTER COLUMN "test_section_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "test_attempt" ALTER COLUMN "test_id" SET NOT NULL;