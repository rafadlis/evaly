import { createOpenAI } from "@ai-sdk/openai";
import { logger, metadata, task } from "@trigger.dev/sdk/v3";
import { Message, streamText, tool as createTool, type TextStreamPart } from "ai";
import { $api } from "../lib/eden";
import { z } from "zod";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type STREAMS = {
  openai: TextStreamPart<{
    questionTool: typeof questionTool;
  }>;
};

export const llmGenerateQuestions = task({
  id: "llm-generate-questions",
  handleError(payload, error, params) {
    logger.error("Error generating questions", { payload, error, params });
  },
  run: async ({
    message,
    templateId,
    cookie,
  }: {
    message: Message;
    templateId: string;
    cookie: string;
  }) => {
    // Get Existing Messages
    const { data: currentMessages, error } =
      await $api.organization.question.llm
        .messages({ templateId })
        .get({ headers: { cookie } });

    if (error) {
      throw new Error("Error getting current messages: " + error?.value);
    }

    const currentFormattedMessages: Message[] = currentMessages.map(
      (message) => ({
        id: message.id,
        content: message.message,
        role: message.role as Message["role"],
        createdAt: new Date(message.createdAt),
        experimental_attachments: message.attachments ?? undefined,
      })
    );

    const result = streamText({
      model: openai("gpt-4o-mini"),
      //   messages: [...currentFormattedMessages, message],
      prompt: "Give me 5 questions",
      maxRetries: 3,
      maxSteps: 5,
      system:
        "You are an expert question generator for educational assessments. Create clear, relevant, and thought-provoking questions tailored to the specific subject matter. For teachers, focus on curriculum-aligned questions that test comprehension and critical thinking. For HR professionals, develop questions that evaluate job-specific knowledge and situational judgment. Include a mix of question types (multiple choice, short answer, scenario-based) and difficulty levels. Each question should have a clear purpose and assess specific knowledge or skills.",
      onError: (error) => {
        logger.error("Error generating questions", { error });
      },
      tools: {
        questionTool,
      },
    });

    const stream = await metadata.stream("openai", result.textStream);

    let text = "";

    for await (const chunk of stream) {
      logger.log("Received chunk", { chunk });

      text += chunk; // chunk is a string
    }

    return { text };
  },
});

export const questionTool = createTool({
  description: "Display a question and options",
  parameters: z.object({
    questions: z.array(
      z.object({
        question: z.string().describe("The question to display"),
        options: z.array(z.string()).describe("The options to display"),
        correctOption: z.string().describe("The correct option"),
      })
    ),
  }),
  execute: async function ({ questions }) {
    return questions;
  },
});
