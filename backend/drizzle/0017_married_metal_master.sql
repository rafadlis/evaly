DROP TABLE "test_session_participant" CASCADE;--> statement-breakpoint
ALTER TABLE "test_attempt" RENAME COLUMN "participant_id" TO "participant_email";