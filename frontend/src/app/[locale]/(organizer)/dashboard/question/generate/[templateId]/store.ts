import { UIMessage } from "ai";
import { create } from "zustand";

interface MessageStore {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages: UIMessage[]) => set({ messages }),
}));

export const useMessages = () => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  return { messages, setMessages };
};
