import { task, metadata, logger } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: "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"
});

export type STREAMS = {
  openai: OpenAI.ChatCompletionChunk; // The type of the chunk is determined by the provider
};

export const myTask = task({
  id: "my-task",
  run: async (payload: { prompt: string }) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: payload.prompt }],
      model: "gpt-4o-mini",
      stream: true,
    });

    // Register the stream with the key "openai"
    // This will "tee" the stream and send it to the metadata system
    const stream = await metadata.stream("openai", completion);

    let text = "";

    // You can read the returned stream as an async iterator
    for await (const chunk of stream) {
      logger.log("Received chunk", { chunk });

      // The type of the chunk is determined by the provider
      text += chunk.choices.map((choice) => choice.delta?.content).join("");
    }

    return { text };
  },
});