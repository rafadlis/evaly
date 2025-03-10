CREATE TABLE "test_attempt" (
	"id" varchar PRIMARY KEY NOT NULL,
	"test_session_id" varchar,
	"participant_id" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "test_attempt_answer" (
	"id" varchar PRIMARY KEY NOT NULL,
	"attempt_id" varchar,
	"question_id" varchar,
	"answer_text" text,
	"answer_options" jsonb,
	"answer_media_url" varchar(512),
	"answer_media_type" varchar(20),
	"change_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "test_session_participant" (
	"id" varchar PRIMARY KEY NOT NULL,
	"test_session_id" varchar,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_session_id_test-session_id_fk" FOREIGN KEY ("test_session_id") REFERENCES "public"."test-session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempt_answer" ADD CONSTRAINT "test_attempt_answer_attempt_id_test_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."test_attempt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempt_answer" ADD CONSTRAINT "test_attempt_answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_session_participant" ADD CONSTRAINT "test_session_participant_test_session_id_test-session_id_fk" FOREIGN KEY ("test_session_id") REFERENCES "public"."test-session"("id") ON DELETE no action ON UPDATE no action;