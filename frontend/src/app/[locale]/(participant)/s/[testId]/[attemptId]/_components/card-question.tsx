import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Question } from "@evaly/backend/types/question";
import { UpdateTestAttemptAnswer } from "@evaly/backend/types/test.attempt";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const [targetOptionId, setTargetOptionId] = useState<string | null>(null);

  const {
    reset,
    control,
    register,
    formState: { isDirty },
    handleSubmit,
    watch,
  } = useForm<UpdateTestAttemptAnswer>({
    defaultValues: defaultAnswer,
  });

  const answerText = watch("answerText");

  useEffect(() => {
    if (defaultAnswer !== undefined) {
      reset(defaultAnswer);
    }
  }, [defaultAnswer, reset]);

  const { mutate: postAnswer, isPending: isPendingAnswer } = useMutation({
    mutationKey: ["post-answer", question.id],
    mutationFn: async (body: UpdateTestAttemptAnswer) => {
      const res = await $api.participant.test
        .attempt({ id: attemptId })
        .answer.post(body);

      const data = res.data;
      setTargetOptionId(null);

      if (res.status !== 200) {
        toast.error(res.error?.value.toString() ?? "Failed to save answer");
        return;
      }

      if (!data) {
        toast.error("Failed to save answer");
        return;
      }

      reset(data);

      return data;
    },
  });

  // Handle option select for option based question
  const handleSubmitAnswer = (data: UpdateTestAttemptAnswer) => {
    postAnswer({
      ...data,
      questionId: question.id,
    });
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
          className="custom-prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: question.question ?? "No question found",
          }}
        />

        {/* Option-based question */}
        {question.type === "multiple-choice" ||
        question.type === "yes-or-no" ? (
          <Controller
            control={control}
            name="answerOptions"
            render={({ field }) => (
              <div className="flex flex-col gap-3 mt-8">
                {question.options?.map((option, i) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-start gap-2 md:gap-4 cursor-pointer  border p-0.5 md:p-1.5",
                      field.value?.includes(option.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent hover:border-primary/50 active:bg-foreground/10"
                    )}
                    onClick={() => {
                      if (isPendingAnswer) return;
                      setTargetOptionId(option.id);
                      handleSubmitAnswer({
                        // Synchronize the answer with the backend
                        answerOptions: [option.id],
                      });
                    }}
                  >
                    <Button
                      variant={
                        field.value?.includes(option.id)
                          ? "outline"
                          : "secondary"
                      }
                      size={"icon-xs"}
                      className="text-primary"
                    >
                      {option.id === targetOptionId && isPendingAnswer ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </Button>
                    <p className="flex-1 pt-0.5 md:text-base text-sm">{option.text}</p>
                  </div>
                ))}
              </div>
            )}
          />
        ) : null}

        {/* Text-based question */}
        {question.type === "text-field" ? (
          <div className="flex flex-col gap-3 mt-8">
            <Textarea
              {...register("answerText")}
              className="resize-none lg:text-base p-4"
              placeholder="Type your answer here..."
            />
            {isDirty && answerText !== "" && (
              <Button
                variant="default"
                size="sm"
                className="w-max"
                onClick={handleSubmit(handleSubmitAnswer)}
              >
                Save
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CardQuestion;
