import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "./store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { Question } from "@evaly/backend/types/question";
import CardQuestion from "@/components/shared/card/card-question";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

const SectionCanvas = () => {
  const { messages, status } = useMessages();
  const [canvasMessageId, setCanvasMessageId] =
    useQueryState("canvasMessageId");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  // Track user scroll manually
  useEffect(() => {
    const canvasContainer = document.querySelector(
      ".scroll-area-viewport"
    ) as HTMLDivElement;
    if (!canvasContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = canvasContainer;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 20; // 20px threshold

      if (!isAtBottom) {
        setUserHasScrolled(true);
      } else {
        setUserHasScrolled(false);
      }
    };

    canvasContainer.addEventListener("scroll", handleScroll);
    return () => canvasContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto scroll to the bottom when messages change and status is "streaming"
  useEffect(() => {
    if (scrollRef.current && status === "streaming" && !userHasScrolled) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, status, userHasScrolled]);

  useEffect(() => {
    if (messages.length > 0) {
      const findLastToolInvocationMessage = messages.findLast((message) =>
        message.parts.some((part) => part.type === "tool-invocation")
      );
      if (findLastToolInvocationMessage) {
        if (findLastToolInvocationMessage.id !== canvasMessageId) {
          setCanvasMessageId(findLastToolInvocationMessage.id);
          // Reset user scrolling when a new message with tool invocation arrives
          setUserHasScrolled(false);
        }
      }
    }
  }, [messages, canvasMessageId, setCanvasMessageId]);

  const selectedToolInvocationMessage = useMemo(() => {
    return messages.find((message) => message.id === canvasMessageId);
  }, [messages, canvasMessageId]);

  return (
    <ScrollArea className="h-[calc(100vh-57px)]">
      <div className="flex flex-col gap-4 py-8 px-6 max-w-[800px] mx-auto">
        {selectedToolInvocationMessage?.parts?.map((part) => {
          if (part.type === "tool-invocation") {
            const { toolCallId, state, toolName, args } = part.toolInvocation;
            if (toolName === "generateQuestion") {
              switch (state) {
                case "call":
                  return (
                    <p key={toolCallId + "-call"}>Generating question...</p>
                  );
                default:
                  const questions = args?.questions as Question[];
                  return (
                    <div key={toolCallId}>
                      <div className="flex justify-between items-end mb-4">
                        <p className="text-sm text-muted-foreground">
                          {questions?.length} questions generated
                        </p>
                        <Button variant={"default"} size={"sm"}>
                          <SaveIcon /> Save Questions
                        </Button>
                      </div>
                      <div className="flex flex-col border border-dashed">
                        {questions?.map((question, index) => (
                          <div key={question.id || index}>
                            <CardQuestion
                              className=""
                              data={{ ...question, order: index + 1 }}
                            />
                            <div className="h-px w-full border-b border-dashed" />
                          </div>
                        ))}
                        <div ref={scrollRef} />
                      </div>
                    </div>
                  );
              }
            }
          }
        })}
      </div>
    </ScrollArea>
  );
};

export default SectionCanvas;
