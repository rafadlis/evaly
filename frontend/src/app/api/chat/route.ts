import { streamText } from "ai";
import { tool as createTool } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey:
    "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",
});

export const weatherTool = createTool({
  description: "Display the weather for a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async function ({ location }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { weather: "Sunny", temperature: 75, location };
  },
});

export const tools = {
  displayWeather: weatherTool,
};
export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o"),
    toolCallStreaming: true,
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
    onFinish: ({ response }) => {
      console.log(JSON.stringify(response, null, 2));
    },
  });

  return result.toDataStreamResponse();
}
