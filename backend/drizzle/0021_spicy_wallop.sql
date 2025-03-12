ALTER TABLE "test_session" RENAME TO "test_section";--> statement-breakpoint
ALTER TABLE "test_attempt" RENAME COLUMN "test_session_id" TO "test_section_id";--> statement-breakpoint
ALTER TABLE "test_attempt" DROP CONSTRAINT "test_attempt_test_session_id_test_session_id_fk";
--> statement-breakpoint
DROP INDEX "unique_test_session_attempt";--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "reference_type" SET DEFAULT 'test-section';--> statement-breakpoint
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_section_id_test_section_id_fk" FOREIGN KEY ("test_section_id") REFERENCES "public"."test_section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_test_section_attempt" ON "test_attempt" USING btree ("test_section_id","test_id","participant_email");