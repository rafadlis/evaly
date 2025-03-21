import { tool as createTool } from "ai";
import { z } from "zod";

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

export const questionTool = createTool({
  description: "Display a question and options",
  parameters: z.object({
    questions: z.array(
      z.object({
        question: z.string().describe("The question to display"),
        options: z.array(z.string()).describe("The options to display"),
        correctOption: z.string().describe("The correct option"),
      })
    )
  }),
  execute: async function ({ questions }) {
    return questions;
  },
});

export const tools = {
  displayWeather: weatherTool,
  generateQuestion: questionTool,
};
