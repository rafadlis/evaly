ALTER TABLE "test-session" RENAME TO "test_session";--> statement-breakpoint
ALTER TABLE "test_attempt" DROP CONSTRAINT "test_attempt_test_session_id_test-session_id_fk";
--> statement-breakpoint
ALTER TABLE "test_session_participant" DROP CONSTRAINT "test_session_participant_test_session_id_test-session_id_fk";
--> statement-breakpoint
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_session_id_test_session_id_fk" FOREIGN KEY ("test_session_id") REFERENCES "public"."test_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_session_participant" ADD CONSTRAINT "test_session_participant_test_session_id_test_session_id_fk" FOREIGN KEY ("test_session_id") REFERENCES "public"."test_session"("id") ON DELETE no action ON UPDATE no action;