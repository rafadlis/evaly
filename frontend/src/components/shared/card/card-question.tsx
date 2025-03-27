import DialogDeleteQuestion from "@/components/shared/dialog/dialog-delete-question";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUpdateBetweenQuestionMutation } from "@/query/organization/question/use-update-between-question.mutation";
import { Question } from "@evaly/backend/types/question";
import { ArrowDown, ArrowUp, CheckIcon, Loader2, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CardQuestion = ({
  className,
  hideOptions = false,
  data,
  onClickEdit,
  onChangeOrder,
  onDeleteSuccess,
  previousQuestionId,
  nextQuestionId,
}: {
  className?: string;
  hideOptions?: boolean;
  data?: Question;
  previousQuestionId?: string;
  nextQuestionId?: string;
  onClickEdit?: () => void;
  onChangeOrder?: (questions: { questionId: string; order: number }[]) => void;
  onDeleteSuccess?: () => void;
}) => {
  const [isMoving, setIsMoving] = useState<"up" | "down">();
  const {
    mutateAsync: updateBetweenQuestion,
    isPending: isPendingUpdateBetweenQuestion,
  } = useUpdateBetweenQuestionMutation();

  const handleMove = async (direction: "up" | "down") => {
    if (!data) return;
    const currentId = data.id;
    setIsMoving(direction);

    // For moving up, we swap with the previous question
    // For moving down, we swap with the next question
    // The index of the question is not important, we just need to swap the order of the questions based on the order-key of the questions
    let questions: { questionId: string; order: number }[] = [];

    if (direction === "up") {
      questions = [
        {
          questionId: currentId,
          order: data.order - 1,
        },
        {
          questionId: previousQuestionId as string,
          order: data.order,
        },
      ];
    } else {
      questions = [
        {
          questionId: currentId,
          order: data.order + 1,
        },
        {
          questionId: nextQuestionId as string,
          order: data.order,
        },
      ];
    }

    // We already checked for undefined IDs above, so we can safely assert these are strings
    await updateBetweenQuestion({
      questions,
    })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      })
      .then(() => {
        setIsMoving(undefined);
        onChangeOrder?.(questions);
      });
  };

  if (!data) return null;

  return (
    <Card
      className={cn(
        "transition-all rounded-none border-transparent cursor-pointer duration-100 group",
        className
      )}
      onClick={onClickEdit}
    >
      <CardHeader className="px-6 flex flex-row justify-between items-center ">
        <div className="flex flex-row gap-3">
          <Badge
            variant={"secondary"}
            className="text-xs px-3 text-muted-foreground"
          >
            # Question {data.order}
          </Badge>
          {data.pointValue ? (
            <Badge
              variant={"secondary"}
              className="text-xs px-3 text-muted-foreground"
            >
              Point: {data.pointValue}
            </Badge>
          ) : null}
          <QuestionTypeSelection
            readonly={true}
            value={data.type}
            className="text-muted-foreground"
            variant={"ghost"}
          />
        </div>
        <div className="flex-row h-5 justify-end items-center hidden group-hover:flex">
          <Button
            className="hidden group-hover:flex mr-2"
            size={"xs"}
            variant={"secondary"}
          >
            <MousePointerClick className="size-4" />
            Click to edit
          </Button>

          {previousQuestionId ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleMove("up");
              }}
              size={"icon-xs"}
              variant={"ghost"}
              disabled={isPendingUpdateBetweenQuestion && isMoving === "up"}
            >
              {isMoving === "up" ? (
                <Loader2 className="text-muted-foreground" />
              ) : (
                <ArrowUp className="text-muted-foreground" />
              )}
            </Button>
          ) : null}

          {nextQuestionId ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleMove("down");
              }}
              size={"icon-xs"}
              variant={"ghost"}
              disabled={
                (isPendingUpdateBetweenQuestion && isMoving === "down") ||
                !nextQuestionId
              }
            >
              {isMoving === "down" ? (
                <Loader2 className="text-muted-foreground" />
              ) : (
                <ArrowDown className="text-muted-foreground" />
              )}
            </Button>
          ) : null}

          <DialogDeleteQuestion
            className="ml-2"
            questionId={data.id}
            onSuccess={() => {
              onDeleteSuccess?.();
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div
          className="custom-prose max-w-full max-h-[220px] min-h-[50px] h-max overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html:
              !data.question || data.question === "<p></p>"
                ? "<p class='text-muted-foreground italic'>No question content. Click to edit.</p>"
                : data.question,
          }}
        />
        {!hideOptions ? (
          <div className="flex flex-row flex-wrap gap-y-3 gap-x-10 text-sm mt-2">
            {data.options?.map((option, i) => (
              <div
                key={option.id || `option-${i}`}
                className={cn(
                  "flex flex-row flex-wrap items-center gap-2",
                  option.isCorrect
                    ? "text-emerald-600 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {option.isCorrect ? (
                  <span className="lowercase">
                    {String.fromCharCode(65 + i)}.
                  </span>
                ) : (
                  <span className="text-muted-foreground lowercase">
                    {String.fromCharCode(65 + i)}.
                  </span>
                )}
                <span className={cn("flex-1")}>
                  {option.text || "Option " + (i + 1)}
                </span>
                {
                  option.isCorrect ? (
                    <CheckIcon size={13} />
                  ) : null
                }
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CardQuestion;
