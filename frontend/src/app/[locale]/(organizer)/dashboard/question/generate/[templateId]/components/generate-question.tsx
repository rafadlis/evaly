import CardQuestion from "@/components/shared/card/card-question";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, SaveIcon } from "lucide-react";
import { ToolInvocation } from "ai";
import { Question } from "@evaly/backend/types/question";
import { useThrottle } from "@/hooks/use-throttle";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useQueryState } from "nuqs";

interface GenerateQuestionProps {
  toolInvocation: ToolInvocation;
}

const GenerateQuestion = ({ toolInvocation }: GenerateQuestionProps) => {
  const { args, state, toolCallId } = toolInvocation;
  const argsQuestions = useThrottle<Question[]>(args?.questions, 200);

  if (state === "call") {
    return <p key={toolCallId + "-call"}>Generating question...</p>;
  }

  if (!argsQuestions) return null;

  return (
    <div key={toolCallId} className="pb-4">
      <div className="flex justify-between items-end mb-4">
        <p className="text-sm text-muted-foreground">
          {argsQuestions.length} questions generated
        </p>
        <Button variant={"default"} size={"sm"}>
          <SaveIcon /> Save Questions
        </Button>
      </div>
      <div className="flex flex-col border border-dashed">
        {argsQuestions.map((question, index) => (
          <div key={question.id || index}>
            <CardQuestion
              className=""
              data={{ ...question, order: index + 1 }}
            />
            <div className="h-px w-full border-b border-dashed" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GenerateQuestionQuestionChat = ({
  toolInvocation,
  messageId,
}: {
  toolInvocation: ToolInvocation;
  messageId: string;
}) => {
  const [canvasMessageId, setCanvasMessageId] =
    useQueryState("canvasMessageId");

  if (
    toolInvocation.state === "call" ||
    toolInvocation.state === "partial-call"
  ) {
    return (
      <>
        <TextShimmer className="text-sm">Generating question...</TextShimmer>
        <div
          key={toolInvocation.toolCallId + "-call"}
          className="p-3 border border-foreground/30 border-dashed text-sm font-medium flex flex-row gap-2 items-center"
        >
          <Loader2 className="size-4 animate-spin stroke-foreground/50" />
          {toolInvocation.args?.questions?.length} questions generated...
        </div>
      </>
    );
  }

  return (
    <>
      <div className="custom-prose lg:prose-sm prose-sm text-sm">
        <Markdown>{toolInvocation.args?.preMessage || ""}</Markdown>
      </div>
      <div className="p-3 border border-foreground/30 border-dashed text-sm font-medium flex flex-col gap-2 items-start">
        <p className="flex-1">
          {toolInvocation.args?.templateTitle || `${toolInvocation.args?.questions?.length} Questions generated`}
        </p>
        <div className="flex flex-row gap-2">
          {canvasMessageId === messageId ? (
            <Button variant={"outline-solid"} size={"xs"}>
              <SaveIcon /> Save Questions
            </Button>
          ) : (
            <Button
              variant={"default"}
              size={"xs"}
              onClick={() => setCanvasMessageId(messageId)}
            >
              Check Questions <ArrowRight />
            </Button>
          )}

          <Badge variant={"secondary"}>
            {toolInvocation.args?.questions?.length} questions
          </Badge>
        </div>
      </div>
    </>
  );
};

export default GenerateQuestion;
