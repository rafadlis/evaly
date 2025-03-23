CREATE INDEX "message_organization_id_index" ON "llm_message" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "llm_message" DROP COLUMN "reference_id";