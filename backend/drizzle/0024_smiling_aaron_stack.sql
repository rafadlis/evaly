ALTER TABLE "test_attempt_answer" ALTER COLUMN "is_correct" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "test_attempt_answer" ALTER COLUMN "is_correct" DROP NOT NULL;