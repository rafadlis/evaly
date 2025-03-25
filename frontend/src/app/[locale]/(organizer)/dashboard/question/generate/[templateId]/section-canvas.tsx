import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "./store";
import { useEffect, useMemo } from "react";
import { useQueryState } from "nuqs";
import GenerateQuestion from "./components/generate-question";
import { ToolInvocation } from "ai";


const ToolComponent = ({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) => {
  const { toolName } = toolInvocation;

  // Add new tool components here
  switch (toolName) {
    case "generateQuestion":
      return (
        <GenerateQuestion
          key={toolInvocation.toolCallId}
          toolInvocation={toolInvocation}
        />
      );
    default:
      return null;
  }
};

const SectionCanvas = () => {
  const { messages } = useMessages();
  const [canvasMessageId, setCanvasMessageId] =
    useQueryState("canvasMessageId");

  // Handle message ID updates
  useEffect(() => {
    if (messages.length > 0) {
      const lastToolMessage = messages.findLast((message) =>
        message.parts.some((part) => part.type === "tool-invocation")
      );
      if (lastToolMessage && lastToolMessage.id !== canvasMessageId) {
        setCanvasMessageId(lastToolMessage.id);
      }
    }
  }, [messages, canvasMessageId, setCanvasMessageId]);

  const selectedToolInvocationMessage = useMemo(() => {
    return messages.find((message) => message.id === canvasMessageId);
  }, [messages, canvasMessageId]);

  return (
    <div className="relative h-[calc(100vh-57px)]">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 py-8 px-6 max-w-[800px] mx-auto">
          {selectedToolInvocationMessage?.parts?.map((part) => {
            if (part.type === "tool-invocation") {
              return (
                <ToolComponent
                  key={part.toolInvocation.toolCallId}
                  toolInvocation={part.toolInvocation}
                />
              );
            }
            return null;
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SectionCanvas;
