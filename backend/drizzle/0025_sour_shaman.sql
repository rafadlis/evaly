DROP INDEX "attempt_id_index";--> statement-breakpoint
CREATE INDEX "test_attempt_test_id_index" ON "test_attempt" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "test_attempt_participant_email_index" ON "test_attempt" USING btree ("participant_email");--> statement-breakpoint
CREATE INDEX "test_attempt_answer_attempt_id_index" ON "test_attempt_answer" USING btree ("attempt_id");--> statement-breakpoint
CREATE INDEX "test_attempt_answer_question_id_index" ON "test_attempt_answer" USING btree ("question_id");