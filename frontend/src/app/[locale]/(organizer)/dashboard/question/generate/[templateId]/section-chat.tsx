import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useOrganizerProfile } from "@/query/organization/profile/use-organizer-profile";
import { ArrowUp, Loader2, Paperclip, UserIcon, Wand2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { useChat } from "@ai-sdk/react";
import { env } from "@/lib/env";
import { Message } from "ai";
import { useMessages } from "./store";

const SectionChat = ({ initialMessages }: { initialMessages: Message[] }) => {
  const { data } = useOrganizerProfile();
  const userProfile = data?.data?.user.image;
  const { templateId } = useParams();
  const [initialMessage, setInitialMessage] = useQueryState("initialMessage");
  const { setMessages, setStatus } = useMessages();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, setInput, status } =
    useChat({
      id: templateId as string,
      key: templateId as string,
      sendExtraMessageFields: true,
      initialMessages: initialMessages,
      initialInput: initialMessage ?? undefined,
      api: `${env.NEXT_PUBLIC_API_URL}/organization/question/llm/chat`,
      credentials: "include",
      body: {
        templateId: templateId as string,
        userPersona: "teacher",
      },
    });

  useEffect(() => {
    setMessages(messages);
    setStatus(status);
  }, [messages, setMessages, status, setStatus]);

  // Scroll to bottom on initial load with a slight delay to ensure DOM is ready
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }, 300); // longer delay to ensure everything is rendered
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Track user scroll manually
  useEffect(() => {
    const chatContainer = document.querySelector('.scroll-area-viewport') as HTMLDivElement;
    if (!chatContainer) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 20; // 20px threshold
      
      if (!isAtBottom) {
        setUserHasScrolled(true);
      } else {
        setUserHasScrolled(false);
      }
    };
    
    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto scroll to the bottom when messages change and status is "streaming"
  useEffect(() => {
    if (scrollRef.current && status === "streaming" && !userHasScrolled) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, status, userHasScrolled]);

  // This is only works if previously user coming from the landing page of chatbot
  useEffect(() => {
    if (initialMessage) {
      setTimeout(() => {
        setInitialMessage(null);
        handleSubmit();
      }, 100);
    }
  }, [initialMessage, setInput, setInitialMessage, handleSubmit]);

  return (
    <>
      <ScrollArea className="h-[calc(100vh-190px)]">
        <div ref={chatContainerRef} className="flex flex-col mx-auto py-6 max-w-xl">
          {messages.map((message) =>
            message.role === "user" ? (
              <UserMessage
                key={message.id}
                image={userProfile}
                message={message}
              />
            ) : (
              <AIMessage key={message.id} message={message} />
            )
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
                setUserHasScrolled(false);
              }
            }}
            placeholder="Add a follow up..."
            className={cn(
              "w-full h-[100px] overflow-clip p-3 rounded-xl [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 transition-all duration-200"
            )}
          />
          <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-end w-full">
            <div className="flex flex-row items-center justify-center gap-1">
              <Button size={"icon-sm"} variant={"ghost"} disabled>
                <Wand2Icon />
              </Button>
              <Button size={"icon-sm"} variant={"ghost"}>
                <Paperclip />
              </Button>
              <Button
                size={"icon-sm"}
                variant={input.length > 0 ? "default" : "secondary-outline"}
                onClick={() => {
                  handleSubmit();
                  setUserHasScrolled(false);
                }}
                disabled={status !== "ready"}
              >
                {status === "streaming" ? (
                  <Loader2 className="size-4 stroke-3 text-muted-foreground animate-spin" />
                ) : (
                  <ArrowUp className="size-4 stroke-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground w-full text-center mt-2 line-clamp-1">
          Evaly may make mistakes. Please use with discretion.
        </p>
      </form>
    </>
  );
};

export default SectionChat;

const UserMessage = ({
  image,
  message,
}: {
  message: Message;
  image: string | null | undefined;
}) => {
  return (
    <div className="flex items-start gap-3 px-6 py-3">
      {image ? (
        <Image
          src={image}
          alt="User"
          width={28}
          height={28}
          className="rounded-lg"
        />
      ) : (
        <div className="rounded-lg bg-muted-foreground/20 size-7 flex items-center justify-center">
          <UserIcon className="size-5" />
        </div>
      )}
      <div className="flex-1 mt-0.5">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};

const AIMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex items-start gap-3 px-6 py-3">
      <Image
        src={"/images/logo.svg"}
        alt="User"
        width={28}
        height={28}
        className="rounded-sm"
      />
      <div className="flex-1 mt-0.5">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};
