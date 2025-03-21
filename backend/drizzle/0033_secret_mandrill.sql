CREATE TABLE "llm_message" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"reference_id" varchar(255) NOT NULL,
	"message" text,
	"type" varchar(20) NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
