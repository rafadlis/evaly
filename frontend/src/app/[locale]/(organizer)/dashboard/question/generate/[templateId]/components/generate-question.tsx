import CardQuestion from "@/components/shared/card/card-question";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { ToolInvocation } from "ai";
import { Question } from "@evaly/backend/types/question";

interface GenerateQuestionProps {
  toolInvocation: ToolInvocation;
}

const GenerateQuestion = ({ toolInvocation }: GenerateQuestionProps) => {
  const { args, state, toolCallId } = toolInvocation;
  if (state === "call") {
    return <p key={toolCallId + "-call"}>Generating question...</p>;
  }

  const questions = args?.questions as Question[];
  if (!questions) return null;

  return (
    <div key={toolCallId}>
      <div className="flex justify-between items-end mb-4">
        <p className="text-sm text-muted-foreground">
          {questions.length} questions generated
        </p>
        <Button variant={"default"} size={"sm"}>
          <SaveIcon /> Save Questions
        </Button>
      </div>
      <div className="flex flex-col border border-dashed">
        {questions.map((question, index) => (
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

  export default GenerateQuestion; 