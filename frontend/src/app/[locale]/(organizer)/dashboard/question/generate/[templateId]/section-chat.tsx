import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useOrganizerProfile } from "@/query/organization/profile/use-organizer-profile";
import {
  ArrowRight,
  Loader2,
  Paperclip,
  UserIcon,
  Wand2Icon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useQueryState } from "nuqs";
import { useChat } from "@ai-sdk/react";
import { env } from "@/lib/env";
import { Message } from "ai";
import { useMessages } from "./store";
import Markdown from "react-markdown";
import { GenerateQuestionQuestionChat } from "./components/generate-question";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { toast } from "sonner";

const SectionChat = ({
  initialMessages,
  className,
}: {
  initialMessages: Message[];
  className?: string;
}) => {
  const { data } = useOrganizerProfile();
  const userProfile = data?.data?.user.image;
  const { templateId } = useParams();
  const [initialMessage, setInitialMessage] = useQueryState("initialMessage");
  const { setMessages, setStatus } = useMessages();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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
        scrollRef.current.scrollIntoView({ block: "end", behavior: "instant" });
      }
    }, 10); // longer delay to ensure everything is rendered

    return () => clearTimeout(timeoutId);
  }, []);

  const submit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (input.trim() === "") return;
      if (status === "submitted" || status === "streaming") {
        toast.error("Please wait for the previous message to be generated.");
        return;
      }
      handleSubmit();
      setInput("");
    },
    [handleSubmit, setInput, input, status]
  );

  // This is only works if previously user coming from the landing page of chatbot
  useEffect(() => {
    if (initialMessage) {
      setTimeout(() => {
        setInitialMessage(null);
        submit();
      }, 100);
    }
  }, [initialMessage, setInput, setInitialMessage, submit]);

  return (
    <div className={cn(className)}>
      <ScrollArea className="h-[calc(100vh-186px)]">
        <div
          ref={chatContainerRef}
          className="flex flex-col mx-auto max-w-xl pt-5 pb-10"
        >
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
          {status === "submitted" ? <LoadingMessage /> : null}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <form onSubmit={submit} className="max-w-xl mx-auto px-4 h-[130px]">
        <div className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
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
                type="submit"
                variant={input.trim() ? "default" : "secondary-outline"}
                disabled={status === "submitted" || status === "streaming"}
              >
                {status === "submitted" || status === "streaming" ? (
                  <Loader2 className="size-4 stroke-3 text-muted-foreground animate-spin" />
                ) : (
                  <ArrowRight className="size-4 stroke-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground w-full text-center mt-1 line-clamp-1">
          Verify content before use. Evaly is still learning.
        </p>
      </form>
    </div>
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
          className="rounded-full"
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
        className="rounded-full"
      />
      <div className="flex-1 mt-0.5 flex flex-col gap-4">
        {message.parts?.map((part) => {
          if (part.type === "tool-invocation") {
            return (
              <GenerateQuestionQuestionChat
                key={part.toolInvocation.toolCallId}
                toolInvocation={part.toolInvocation}
                messageId={message.id}
              />
            );
          }
          return null;
        })}

        {message.content && (
          <div className="custom-prose lg:prose-sm prose-sm text-sm">
            <Markdown>{message.content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingMessage = () => {
  return (
    <div className="flex items-start gap-3 px-6 py-3">
      <Image
        src={"/images/logo.svg"}
        alt="User"
        width={28}
        height={28}
        className="rounded-full"
      />
      <TextShimmer className="flex-1 mt-0.5 text-sm">Thinking...</TextShimmer>
    </div>
  );
};
