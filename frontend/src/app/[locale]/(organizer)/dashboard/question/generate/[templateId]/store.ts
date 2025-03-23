import { Question } from "@evaly/backend/types/question";
import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  preMessage: string;
  questions?: Question[];
  postMessage?: string;
}

interface MessageState {
  messages: Message[];
  upsertMessage: (message: Message) => void;
}

const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  upsertMessage: (message: Message) => set((state: MessageState) => {
    const existingIndex = state.messages.findIndex((m) => m.id === message.id);
    
    if (existingIndex >= 0) {
      // Update existing message
      const updatedMessages = [...state.messages];
      updatedMessages[existingIndex] = message;
      return { messages: updatedMessages };
    } else {
      // Add new message
      return { messages: [...state.messages, message] };
    }
  }),
}));

export function useMessages() {
  const messages = useMessageStore((state) => state.messages);
  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  return { messages, upsertMessage };
}

export function useMessageQuestions(){
  const messages = useMessageStore((state) => state.messages);
  // find the last message with questions
  const lastMessageWithQuestions = messages.findLast((message) => message.questions);
  return lastMessageWithQuestions?.questions;
}