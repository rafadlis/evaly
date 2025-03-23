import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useOrganizerProfile } from "@/query/organization/profile/use-organizer-profile";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp, Loader2, Paperclip, UserIcon, Wand2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Message, useMessages } from "./store";
import { useQueryState } from "nuqs";
import { parsePartialJson } from "@ai-sdk/ui-utils";
import { ulid } from "ulidx";

const SectionChat = () => {
  const { data } = useOrganizerProfile();
  const userProfile = data?.data?.user.image;
  const { templateId } = useParams();
  const [initialMessage, setInitialMessage] = useQueryState("initialMessage");

  const { messages, upsertMessage } = useMessages();

  const { mutate: generateQuestions } = useMutation({
    mutationKey: ["generate-questions", templateId],
    mutationFn: async (message: string) => {
      upsertMessage({
        id: `llm_${ulid()}`,
        role: "user",
        preMessage: message,
      });

      const res = await $api.organization.question.llm.chat.post({
        message,
        id: templateId as string,
        userPersona: "teacher",
      });

      if (!res.data) return null;

      let result = "";
      const assistantMessageId = `llm_${ulid()}`;

      for await (const chunk of res.data) {
        result += chunk;
        const parsed = parsePartialJson(result).value as unknown as Message;
        upsertMessage({ ...parsed, role: "assistant", id: assistantMessageId });
      }

      return result;
    },
  });

  useEffect(() => {
    if (initialMessage) {
      generateQuestions(initialMessage);
      // setInitialMessage(null);
    }
  }, [generateQuestions, initialMessage, setInitialMessage]);

  return (
    <>
      <ScrollArea className="h-[calc(100vh-220px)] flex flex-col">
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} image={userProfile} message={message} />
          ) : (
            <AIMessage key={message.id} message={message} />
          )
        )}
      </ScrollArea>
      <div className="relative mb-2 mx-4 mt-2">
        <Textarea
          autoFocus
          placeholder="Add a follow up..."
          className={cn(
            "w-full h-[120px] overflow-clip  p-3 rounded-xl [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:border-foreground/20 shadow-none transition-all duration-200"
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
            <Button size={"icon-sm"} variant={"outline"}>
              {false ? (
                <Loader2 className="size-4 stroke-3 text-muted-foreground" />
              ) : (
                <ArrowUp className="size-4 stroke-3 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground w-full text-center">
        Evaly may make mistakes. Please use with discretion.
      </p>
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
    <div className="flex items-start gap-3 p-4 hover:bg-secondary">
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
      <div className="flex-1">
        <p className="text-sm">{message.preMessage}</p>
      </div>
    </div>
  );
};

const AIMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-secondary">
      <Image
        src={"/images/logo.svg"}
        alt="User"
        width={28}
        height={28}
        className="rounded-lg object-scale-down"
      />
       <div className="flex-1">
        <p className="text-sm">{message.preMessage}</p>
        {message.questions?.length && message.questions.length > 0 ? (
          <Button variant={"secondary"} size={"xs"} className="mt-2">
            See {message.questions.length} questions
          </Button>
        ) : null}

        {message.postMessage ? (
          <p className="text-sm mt-2">{message.postMessage}</p>
        ) : null}
      </div>
    </div>
  );
};
