CREATE TABLE "account" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" varchar(255),
	"id_token" text,
	"password" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" varchar(255),
	"user_agent" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" varchar(255),
	"selected_organizer_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo_url" varchar(255),
	"type" varchar(50) DEFAULT 'other',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organizer" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"level" varchar(10) NOT NULL,
	"organizationRole" varchar(100) DEFAULT 'other',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "test" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"type" varchar(20) DEFAULT 'self-paced' NOT NULL,
	"access" varchar(20) DEFAULT 'public',
	"section_selection_mode" varchar(20) DEFAULT 'random',
	"result_visibility" varchar(20) DEFAULT 'after_completion',
	"requires_login" boolean DEFAULT true,
	"is_published" boolean DEFAULT false,
	"description" text,
	"created_by_organizer_id" varchar(255) NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"held_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "test_section" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"duration" smallint DEFAULT 0,
	"order" smallint,
	"test_id" varchar(255) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "code_editor_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"language" varchar(50) NOT NULL,
	"initial_code" text,
	"solution_code" text,
	"test_cases" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "code_editor_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "date_time_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"min_date" timestamp with time zone,
	"max_date" timestamp with time zone,
	"correct_date" timestamp with time zone,
	"format" varchar(50),
	"allow_time_selection" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "date_time_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "fill_blank_segment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"segment_order" integer NOT NULL,
	"segment_text" text,
	"is_blank" boolean NOT NULL,
	"expected_answer" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formula_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"correct_formula" text,
	"variables" jsonb,
	"allowed_functions" text[] NOT NULL,
	"tolerance" text,
	"case_sensitive" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "formula_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "hotspot_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"image_url" text NOT NULL,
	"hotspots" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "hotspot_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "matching_pair" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"left_item" text NOT NULL,
	"right_item" text NOT NULL,
	"order" smallint,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matrix_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"rows" text[] NOT NULL,
	"columns" text[] NOT NULL,
	"matrix_type" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "matrix_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "media_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"media_type" varchar(10) NOT NULL,
	"max_file_size_mb" integer,
	"sample_response_url" text,
	"instructions" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "media_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question" text,
	"reference_id" varchar(255) NOT NULL,
	"organization_id" varchar(255),
	"order" smallint DEFAULT 1 NOT NULL,
	"type" varchar(20) DEFAULT 'multiple-choice',
	"point_value" smallint,
	"options" jsonb DEFAULT '[]'::jsonb,
	"allow_multiple_answers" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "slider_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"min_value" integer NOT NULL,
	"max_value" integer NOT NULL,
	"step" integer DEFAULT 1,
	"default_value" integer,
	"min_label" text,
	"max_label" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "slider_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "text_field_config" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"model_answer" text,
	"min_length" integer,
	"max_length" integer,
	"placeholder" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "text_field_config_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "question_template" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"organization_id" varchar(255) NOT NULL,
	"organizer_id" varchar(255) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_ai_generated" boolean DEFAULT false NOT NULL,
	"is_generating" boolean DEFAULT false NOT NULL,
	"is_generating_expired_at" timestamp with time zone,
	"ai_contents" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "test_invitation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"test_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_email_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_attempt" (
	"id" varchar PRIMARY KEY NOT NULL,
	"test_section_id" varchar NOT NULL,
	"test_id" varchar NOT NULL,
	"participant_email" varchar NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
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
	"is_correct" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "organizer" ADD CONSTRAINT "organizer_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizer" ADD CONSTRAINT "organizer_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_editor_config" ADD CONSTRAINT "code_editor_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_time_config" ADD CONSTRAINT "date_time_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fill_blank_segment" ADD CONSTRAINT "fill_blank_segment_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_config" ADD CONSTRAINT "formula_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotspot_config" ADD CONSTRAINT "hotspot_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matching_pair" ADD CONSTRAINT "matching_pair_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matrix_config" ADD CONSTRAINT "matrix_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_config" ADD CONSTRAINT "media_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slider_config" ADD CONSTRAINT "slider_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_field_config" ADD CONSTRAINT "text_field_config_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_section_id_test_section_id_fk" FOREIGN KEY ("test_section_id") REFERENCES "public"."test_section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempt_answer" ADD CONSTRAINT "test_attempt_answer_attempt_id_test_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."test_attempt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_attempt_answer" ADD CONSTRAINT "test_attempt_answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_account_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "provider_idx" ON "account" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "organization_id_idx" ON "organization" USING btree ("id");--> statement-breakpoint
CREATE INDEX "organizer_id_idx" ON "organizer" USING btree ("id");--> statement-breakpoint
CREATE INDEX "code_question_idx" ON "code_editor_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "date_question_idx" ON "date_time_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "blank_question_idx" ON "fill_blank_segment" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "blank_order_idx" ON "fill_blank_segment" USING btree ("question_id","segment_order");--> statement-breakpoint
CREATE INDEX "formula_question_idx" ON "formula_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "hotspot_question_idx" ON "hotspot_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "matching_question_idx" ON "matching_pair" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "matrix_question_idx" ON "matrix_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "media_question_idx" ON "media_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "reference_idx" ON "question" USING btree ("reference_id");--> statement-breakpoint
CREATE INDEX "slider_question_idx" ON "slider_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "textfield_question_idx" ON "text_field_config" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "question_template_organization_id_idx" ON "question_template" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "question_template_organizer_id_idx" ON "question_template" USING btree ("organizer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_test_id_unique" ON "test_invitation" USING btree ("email","test_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_test_section_attempt" ON "test_attempt" USING btree ("test_section_id","test_id","participant_email");--> statement-breakpoint
CREATE INDEX "test_attempt_test_id_index" ON "test_attempt" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "test_attempt_participant_email_index" ON "test_attempt" USING btree ("participant_email");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_attempt_question" ON "test_attempt_answer" USING btree ("attempt_id","question_id");--> statement-breakpoint
CREATE INDEX "test_attempt_answer_attempt_id_index" ON "test_attempt_answer" USING btree ("attempt_id");--> statement-breakpoint
CREATE INDEX "test_attempt_answer_question_id_index" ON "test_attempt_answer" USING btree ("question_id");