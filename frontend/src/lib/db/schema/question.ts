import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { testSession } from "./test.session";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Define question types as a constant that can be reused
export const QUESTION_TYPES = [
  "single-choice", // Participant selects 1 correct answer (radio buttons)
  "multiple-choice", // Participant can select more than 1 correct answer (checkboxes)
  "yes-or-no", // Simple binary choice (Yes/No)
  "point-based", // Answer earns points based on correctness
  "text-field", // Open-ended text response
  "file-upload", // Participant uploads a file as an answer
  "fill-the-blank", // Participant fills in missing words in a sentence
  "audio-response", // Participant records and submits an audio response
  "video-response", // Participant records and submits a video response
  "dropdown", // Single-choice selection from a dropdown menu
  "ranking", // Participants reorder options based on priority/preference
  "slider-scale", // Select a value on a sliding scale (e.g., 1-10)
  "date-picker", // Select a date from a calendar input
  "time-picker", // Select a specific time
  "image-choice", // Choose an answer by selecting an image
  "matching-pairs", // Drag & drop or dropdown-based matching of related terms
  "matrix", // Grid-based response format for rating multiple items at once
  "hotspot", // Click on a specific area in an image as the answer
  "formula-input", // Input mathematical expressions or equations
  "code-editor", // Answer by writing and submitting code (for programming assessments)
] as const;

// Define media types constant
export const MEDIA_TYPES = ["audio", "video", "file", "image"] as const;

// Create a Zod enum schema for question types
export const zodQuestionType = z.enum(QUESTION_TYPES);
export type QuestionType = z.infer<typeof zodQuestionType>;

// Create a Zod enum schema for media types
export const zodMediaType = z.enum(MEDIA_TYPES);
export type MediaType = z.infer<typeof zodMediaType>;

// Main question table
export const question = pgTable(
  "question",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "qst-" + ulid()),
    question: text("question"),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
    order: smallint("order"),
    type: varchar("type", {
      length: 20,
      enum: QUESTION_TYPES,
    }).default("multiple-choice"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    deletedAt: timestamp("deleted_at", {
      mode: "string",
      withTimezone: true,
    }),
  },
  (table) => ({
    referenceIdIndex: index("reference_idx").on(table.referenceId),
  })
);

// Options table for questions with predefined options
export const questionOption = pgTable(
  "question_option",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "opt-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    optionText: text("option_text").notNull(),
    isCorrect: boolean("is_correct"),
    pointValue: integer("point_value"),
    order: smallint("order"),
    imageUrl: text("image_url"), // For image-choice questions
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("option_question_idx").on(table.questionId),
  })
);

// Text field configuration (for text-field type questions)
export const textFieldConfig = pgTable(
  "text_field_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "txt-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    modelAnswer: text("model_answer"),
    minLength: integer("min_length"),
    maxLength: integer("max_length"),
    placeholder: text("placeholder"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("textfield_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One config per question
  })
);

// Fill-the-blank segments (for fill-the-blank questions)
export const fillBlankSegment = pgTable(
  "fill_blank_segment",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "blk-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    segmentOrder: integer("segment_order").notNull(),
    segmentText: text("segment_text"),
    isBlank: boolean("is_blank").notNull(),
    expectedAnswer: text("expected_answer"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("blank_question_idx").on(table.questionId),
    orderIndex: index("blank_order_idx").on(
      table.questionId,
      table.segmentOrder
    ),
  })
);

// Media response configuration (for audio/video/file upload questions)
export const mediaConfig = pgTable(
  "media_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "med-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    mediaType: varchar("media_type", {
      length: 10,
      enum: MEDIA_TYPES,
    }).notNull(),
    allowedFormats: text("allowed_formats", {
      enum: ["audio", "video", "file", "image"],
    }).array().notNull(),
    maxFileSizeMb: integer("max_file_size_mb"),
    sampleResponseUrl: text("sample_response_url"),
    instructions: text("instructions"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("media_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One media config per question
  })
);

// Slider configuration (for slider-scale questions)
export const sliderConfig = pgTable(
  "slider_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "sld-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    minValue: integer("min_value").notNull(),
    maxValue: integer("max_value").notNull(),
    step: integer("step").default(1),
    defaultValue: integer("default_value"),
    minLabel: text("min_label"),
    maxLabel: text("max_label"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("slider_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One slider config per question
  })
);

// Matching pairs (for matching-pairs questions)
export const matchingPair = pgTable(
  "matching_pair",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "mpr-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    leftItem: text("left_item").notNull(),
    rightItem: text("right_item").notNull(),
    order: smallint("order"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("matching_question_idx").on(table.questionId),
  })
);

// Matrix configuration (for matrix questions)
export const matrixConfig = pgTable(
  "matrix_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "mtx-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    rows: text("rows").array().notNull(),
    columns: text("columns").array().notNull(),
    matrixType: varchar("matrix_type", { length: 20 }).notNull(), // e.g., "likert", "rating", "checkboxes"
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("matrix_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One matrix config per question
  })
);

// Hotspot configuration (for hotspot questions)
export const hotspotConfig = pgTable(
  "hotspot_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "hsp-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    hotspots: jsonb("hotspots").notNull(), // Array of {x, y, width, height, isCorrect, label}
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("hotspot_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One hotspot config per question
  })
);

// Code editor configuration (for code-editor questions)
export const codeEditorConfig = pgTable(
  "code_editor_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "code-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    language: varchar("language", { length: 50 }).notNull(), // e.g., "javascript", "python"
    initialCode: text("initial_code"),
    solutionCode: text("solution_code"),
    testCases: jsonb("test_cases"), // Array of test cases to validate code
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("code_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One code config per question
  })
);

// Date-time picker configuration (for date-picker and time-picker questions)
export const dateTimeConfig = pgTable(
  "date_time_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "dt-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    minDate: timestamp("min_date", { mode: "string", withTimezone: true }),
    maxDate: timestamp("max_date", { mode: "string", withTimezone: true }),
    correctDate: timestamp("correct_date", {
      mode: "string",
      withTimezone: true,
    }),
    format: varchar("format", { length: 50 }), // Format string (e.g., "YYYY-MM-DD")
    allowTimeSelection: boolean("allow_time_selection").default(false),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("date_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One date/time config per question
  })
);

// Formula configuration (for formula-input questions)
export const formulaConfig = pgTable(
  "formula_config",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "frm-" + ulid()),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    correctFormula: text("correct_formula"),
    variables: jsonb("variables"), // Array of allowed variables with descriptions
    allowedFunctions: text("allowed_functions").array().notNull(),
    tolerance: text("tolerance"), // For numeric answers, how close is considered correct
    caseSensitive: boolean("case_sensitive").default(false),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    questionIdIndex: index("formula_question_idx").on(table.questionId),
    uniqueQuestion: unique().on(table.questionId), // One formula config per question
  })
);

//Relations
export const questionRelation = relations(question, ({ one, many }) => ({
  testSession: one(testSession, {
    fields: [question.referenceId],
    references: [testSession.id],
    relationName: "testSession.question",
  }),
  options: many(questionOption),
  textFieldConfig: one(textFieldConfig),
  fillBlankSegments: many(fillBlankSegment),
  mediaConfig: one(mediaConfig),
  sliderConfig: one(sliderConfig),
  matchingPairs: many(matchingPair),
  matrixConfig: one(matrixConfig),
  hotspotConfig: one(hotspotConfig),
  codeEditorConfig: one(codeEditorConfig),
  dateTimeConfig: one(dateTimeConfig),
  formulaConfig: one(formulaConfig),
}));

export const questionOptionRelation = relations(questionOption, ({ one }) => ({
  question: one(question, {
    fields: [questionOption.questionId],
    references: [question.id],
    relationName: "question.options",
  }),
}));

export const textFieldConfigRelation = relations(
  textFieldConfig,
  ({ one }) => ({
    question: one(question, {
      fields: [textFieldConfig.questionId],
      references: [question.id],
      relationName: "question.textFieldConfig",
    }),
  })
);

export const fillBlankSegmentRelation = relations(
  fillBlankSegment,
  ({ one }) => ({
    question: one(question, {
      fields: [fillBlankSegment.questionId],
      references: [question.id],
      relationName: "question.fillBlankSegments",
    }),
  })
);

export const mediaConfigRelation = relations(mediaConfig, ({ one }) => ({
  question: one(question, {
    fields: [mediaConfig.questionId],
    references: [question.id],
    relationName: "question.mediaConfig",
  }),
}));

export const sliderConfigRelation = relations(sliderConfig, ({ one }) => ({
  question: one(question, {
    fields: [sliderConfig.questionId],
    references: [question.id],
    relationName: "question.sliderConfig",
  }),
}));

export const matchingPairRelation = relations(matchingPair, ({ one }) => ({
  question: one(question, {
    fields: [matchingPair.questionId],
    references: [question.id],
    relationName: "question.matchingPairs",
  }),
}));

export const matrixConfigRelation = relations(matrixConfig, ({ one }) => ({
  question: one(question, {
    fields: [matrixConfig.questionId],
    references: [question.id],
    relationName: "question.matrixConfig",
  }),
}));

export const hotspotConfigRelation = relations(hotspotConfig, ({ one }) => ({
  question: one(question, {
    fields: [hotspotConfig.questionId],
    references: [question.id],
    relationName: "question.hotspotConfig",
  }),
}));

export const codeEditorConfigRelation = relations(
  codeEditorConfig,
  ({ one }) => ({
    question: one(question, {
      fields: [codeEditorConfig.questionId],
      references: [question.id],
      relationName: "question.codeEditorConfig",
    }),
  })
);

export const dateTimeConfigRelation = relations(dateTimeConfig, ({ one }) => ({
  question: one(question, {
    fields: [dateTimeConfig.questionId],
    references: [question.id],
    relationName: "question.dateTimeConfig",
  }),
}));

export const formulaConfigRelation = relations(formulaConfig, ({ one }) => ({
  question: one(question, {
    fields: [formulaConfig.questionId],
    references: [question.id],
    relationName: "question.formulaConfig",
  }),
}));

// Types and Zod schemas for main question entity
export type Question = typeof question.$inferSelect;
export type InsertQuestion = typeof question.$inferInsert;
export type UpdateQuestion = Partial<InsertQuestion>;

export const zodSelectQuestion = createSelectSchema(question);
export const zodInsertQuestion = createInsertSchema(question);
export const zodUpdateQuestion = zodInsertQuestion.partial();

// Types and Zod schemas for options
export type QuestionOption = typeof questionOption.$inferSelect;
export type InsertQuestionOption = typeof questionOption.$inferInsert;

export const zodSelectQuestionOption = createSelectSchema(questionOption);
export const zodInsertQuestionOption = createInsertSchema(questionOption);

// Helper interfaces for creating different question types
export interface BaseQuestionInput {
  question: string;
  referenceId: string;
  order?: number;
}

export interface ChoiceQuestionInput extends BaseQuestionInput {
  type:
    | "single-choice"
    | "multiple-choice"
    | "yes-or-no"
    | "point-based"
    | "dropdown"
    | "image-choice";
  options: Array<{
    optionText: string;
    isCorrect?: boolean;
    pointValue?: number;
    order?: number;
    imageUrl?: string;
  }>;
}

export interface TextFieldQuestionInput extends BaseQuestionInput {
  type: "text-field";
  textField: {
    modelAnswer?: string;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
  };
}

export interface FillBlankQuestionInput extends BaseQuestionInput {
  type: "fill-the-blank";
  segments: Array<{
    segmentOrder: number;
    segmentText?: string;
    isBlank: boolean;
    expectedAnswer?: string;
  }>;
}

export interface MediaQuestionInput extends BaseQuestionInput {
  type: "file-upload" | "audio-response" | "video-response";
  mediaConfig: {
    mediaType: MediaType;
    allowedFormats?: string[];
    maxFileSizeMb?: number;
    sampleResponseUrl?: string;
    instructions?: string;
  };
}

// Complete Zod validation schemas for all question types
export const zodChoiceQuestionInput = z.object({
  question: z.string(),
  referenceId: z.string(),
  order: z.number().optional(),
  type: z.enum([
    "single-choice",
    "multiple-choice",
    "yes-or-no",
    "point-based",
    "dropdown",
    "image-choice",
  ]),
  options: z.array(
    z.object({
      optionText: z.string(),
      isCorrect: z.boolean().optional(),
      pointValue: z.number().optional(),
      order: z.number().optional(),
      imageUrl: z.string().optional(),
    })
  ),
});

export const zodTextFieldQuestionInput = z.object({
  question: z.string(),
  referenceId: z.string(),
  order: z.number().optional(),
  type: z.literal("text-field"),
  textField: z.object({
    modelAnswer: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    placeholder: z.string().optional(),
  }),
});

export const zodFillBlankQuestionInput = z.object({
  question: z.string(),
  referenceId: z.string(),
  order: z.number().optional(),
  type: z.literal("fill-the-blank"),
  segments: z.array(
    z.object({
      segmentOrder: z.number(),
      segmentText: z.string().optional(),
      isBlank: z.boolean(),
      expectedAnswer: z.string().optional(),
    })
  ),
});

export const zodMediaQuestionInput = z.object({
  question: z.string(),
  referenceId: z.string(),
  order: z.number().optional(),
  type: z.enum(["file-upload", "audio-response", "video-response"]),
  mediaConfig: z.object({
    mediaType: zodMediaType,
    allowedFormats: z.array(z.string()).optional(),
    maxFileSizeMb: z.number().optional(),
    sampleResponseUrl: z.string().optional(),
    instructions: z.string().optional(),
  }),
});

// More schemas for other question types can be added similarly
