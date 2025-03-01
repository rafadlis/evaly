import DialogDeleteQuestion from "@/components/shared/dialog/dialog-delete-question";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { question } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, CircleHelpIcon } from "lucide-react";

const CardQuestion = ({
  className,
  // hideOptions = false,
  data,
  onClickEdit,
  onMoveUp,
  onMoveDown,
  onDeleteSuccess,
}: {
  className?: string;
  hideOptions?: boolean;
  data?: typeof question.$inferSelect;
  onClickEdit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDeleteSuccess?: () => void;
}) => {
  if (!data) return null;
  return (
    <Card
      className={cn(
        "transition-all hover:border-foreground/50 cursor-pointer",
        className
      )}
      onClick={onClickEdit}
    >
      <CardHeader className="border-b py-3 flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3">
          <Button variant={"secondary"} size={"xs"} rounded={true}>
            <CircleHelpIcon />
            Question {data.order}
          </Button>
          <QuestionTypeSelection value={data.type} />
        </div>
        <div className="flex flex-row h-5 justify-end items-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp?.();
            }}
            size={"icon-xs"}
            variant={"ghost"}
            rounded={false}
          >
            <ArrowUp className="text-muted-foreground" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown?.();
            }}
            size={"icon-xs"}
            variant={"ghost"}
            rounded={false}
          >
            <ArrowDown className="text-muted-foreground" />
          </Button>
          <DialogDeleteQuestion
            className="ml-2"
            questionId={data.id}
            onSuccess={() => {
              onDeleteSuccess?.();
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="custom-prose"
          dangerouslySetInnerHTML={{
            __html:
              !data.question || data.question === "<p></p>"
                ? "<p class='text-muted-foreground italic'>No question content. Click to edit.</p>"
                : data.question,
          }}
        />
        {/* {!hideOptions ? (
            <div className="flex flex-col gap-4 mt-6 text-sm text-muted-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-row flex-wrap items-start gap-3"
                >
                  <Button rounded={false} size={"icon-xs"} variant={"outline"}>
                    {i + 1}
                  </Button>
                  <span className="flex-1 mt-0.5">Option {i + 1}</span>
                </div>
              ))}
            </div>
          ) : null} */}
      </CardContent>
    </Card>
  );
};

export default CardQuestion;
