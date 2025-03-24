import { UIMessage } from "ai";
import { create } from "zustand";

interface MessageStore {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
  status: "submitted" | "streaming" | "ready" | "error",
  setStatus: (status: "submitted" | "streaming" | "ready" | "error") => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages: UIMessage[]) => set({ messages }),
  status: "submitted",
  setStatus: (status: "submitted" | "streaming" | "ready" | "error") => set({ status }),
}));

export const useMessages = () => {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const status = useMessageStore((state) => state.status);
  const setStatus = useMessageStore((state) => state.setStatus);
  return { messages, setMessages, status, setStatus };
};
