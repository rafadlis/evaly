import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "./store";
import { useEffect, useMemo, useRef } from "react";
import { useQueryState } from "nuqs";
import { Question } from "@evaly/backend/types/question";
import CardQuestion from "@/components/shared/card/card-question";

const SectionCanvas = () => {
  const { messages } = useMessages();
  const [canvasMessageId, setCanvasMessageId] =
    useQueryState("canvasMessageId");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const findLastToolInvocationMessage = messages.findLast((message) =>
        message.parts.some((part) => part.type === "tool-invocation")
      );
      if (findLastToolInvocationMessage) {
        if (findLastToolInvocationMessage.id !== canvasMessageId) {
          setCanvasMessageId(findLastToolInvocationMessage.id);
        }
      }
    }
  }, [messages, canvasMessageId, setCanvasMessageId]);

  const selectedToolInvocationMessage = useMemo(() => {
    return messages.find((message) => message.id === canvasMessageId);
  }, [messages, canvasMessageId]);

  // Scroll to bottom when new content is generated
  useEffect(() => {
    if (contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedToolInvocationMessage]);

  return (
    <ScrollArea className="h-[calc(100vh-57px)]" ref={scrollContainerRef}>
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
                    <div key={toolCallId} className="flex flex-col">
                      {questions?.map((question, index) => (
                        <div key={question.id || index}>
                          <CardQuestion
                            className=""
                            data={{ ...question, order: index + 1 }}
                          />
                          <div className="h-px w-full border-b border-dashed" />
                        </div>
                      ))}
                    </div>
                  );
              }
            }
          }
        })}
        {/* Reference element for auto-scrolling */}
        <div ref={contentEndRef} />
      </div>
    </ScrollArea>
  );
};

export default SectionCanvas;
