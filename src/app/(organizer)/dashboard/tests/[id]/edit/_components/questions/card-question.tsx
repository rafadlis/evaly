import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { question } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, CircleHelpIcon, Trash2Icon } from "lucide-react";

const CardQuestion = ({
  className,
  // hideOptions = false,
  data,
  onClickEdit,
  onMoveUp,
  onMoveDown,
}: {
  className?: string;
  hideOptions?: boolean;
  data?: typeof question.$inferSelect;
  onClickEdit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
          <QuestionTypeSelection value="multiple-choice" />
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
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            size={"icon-xs"}
            variant={"ghost"}
            rounded={false}
            className="ml-2"
          >
            <Trash2Icon className="text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="custom-prose"
          dangerouslySetInnerHTML={{
            __html:
              data.question ||
              "<p class='text-muted-foreground italic'>No question content. Click to edit.</p>",
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
