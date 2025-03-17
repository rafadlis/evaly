CREATE TABLE "question_template" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"organizer_id" varchar(255) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_ai_generated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "question_template_organization_id_idx" ON "question_template" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "question_template_organizer_id_idx" ON "question_template" USING btree ("organizer_id");