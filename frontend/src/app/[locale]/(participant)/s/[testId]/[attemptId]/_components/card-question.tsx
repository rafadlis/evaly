import { Button } from "@/components/ui/button";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Question } from "@evaly/backend/types/question";
import { UpdateTestAttemptAnswer } from "@evaly/backend/types/test.attempt";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const CardQuestion = ({
  question,
  i,
  defaultAnswer,
  attemptId,
}: {
  question: Partial<Question>;
  i: number;
  defaultAnswer?: UpdateTestAttemptAnswer;
  attemptId: string;
}) => {
  const [localAnswer, setLocalAnswer] = useState<
    UpdateTestAttemptAnswer | undefined
  >(defaultAnswer);

  useEffect(() => {
    if (defaultAnswer !== undefined) {
      setLocalAnswer(defaultAnswer);
    }
  }, [defaultAnswer]);

  const { mutate: postAnswer, isPending: isPendingAnswer } = useMutation({
    mutationKey: ["post-answer", question.id],
    mutationFn: async (body: UpdateTestAttemptAnswer) => {
      const res = await $api.participant.test
        .attempt({ id: attemptId })
        .answer.post(body);

      if (res.status !== 200) {
        throw new Error(res.error?.value.toString());
      }

      const data = res.data;

      if (!data) {
        throw new Error("Failed to save answer");
      }

      return data;
    },
  });

  // Handle option select for option based question
  const handleOptionSelect = (optionId: string) => {
    setLocalAnswer({
      ...localAnswer,
      questionId: question.id,
      answerOptions: [optionId],
    });
    postAnswer({ questionId: question.id, answerOptions: [optionId] });
  };

  return (
    <div className="py-12">
      <div className="flex flex-row justify-between items-center">
        <span className=" text-sm text-muted-foreground">Question {i + 1}</span>
        <span className=" text-sm text-muted-foreground flex flex-row gap-2 items-center">
          {isPendingAnswer ? (
            <>
              <Loader2 className="size-3 animate-spin" /> Saving...
            </>
          ) : null}
        </span>
      </div>
      <div className="mt-2">
        <div
          className="custom-prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: question.question ?? "No question found",
          }}
        />

        <div className="flex flex-col gap-4 mt-8">
          {question.options?.map((option, i) => (
            <div
              key={option.id}
              className={cn(
                "flex items-start gap-4 cursor-pointer transition-colors duration-100 border active:border-primary/30 p-2",
                localAnswer?.answerOptions?.includes(option.id)
                  ? "border-primary/50 bg-secondary"
                  : "border-border bg-transparent hover:bg-secondary "
              )}
              onClick={() => handleOptionSelect(option.id)}
            >
              <Button
                variant={
                  localAnswer?.answerOptions?.includes(option.id)
                    ? "default"
                    : "secondary"
                }
                size={"icon-xs"}
              >
                {localAnswer?.answerOptions?.includes(option.id) &&
                isPendingAnswer ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </Button>
              <p className="flex-1 pt-0.5">{option.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardQuestion;
