import BackButton from "@/components/shared/back-button";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question-2";
import { Button } from "@/components/ui/button";
import { $api } from "@/lib/api";
import { useQuestionTemplateById } from "@/query/organization/question/use-question-template-by-id";
import { Question, QuestionTemplate } from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import { SetStateAction, useEffect } from "react";
import { Dispatch } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import TagsInput from "@/components/ui/tags-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import DialogDeleteQuestionTemplate from "@/components/shared/dialog/dialog-delete-question-template";
import { useRouter } from "@/i18n/navigation";

const Header = ({
  templateId,
  setLocalQuestions,
  setSelectedEditQuestion,
  totalQuestions,
}: {
  templateId: string;
  totalQuestions: number;
  setLocalQuestions: Dispatch<SetStateAction<Question[]>>;
  setSelectedEditQuestion: Dispatch<SetStateAction<Question | undefined>>;
}) => {
  const { data: questionTemplate, isLoading: isLoadingQuestionTemplate } =
    useQuestionTemplateById(templateId);

  const router = useRouter();

  const {
    mutate: updateQuestionTemplate,
    isPending: isUpdatingQuestionTemplate,
  } = useMutation({
    mutationKey: ["update-question-template"],
    mutationFn: async (data: QuestionTemplate) => {
      const res = await $api.organization.question
        .template({ id: templateId })
        .put(data);
      if (!res.data) {
        toast.error("Failed to update question template");
        return;
      }
      reset(res.data);
    },
  });

  const {
    register,
    formState: { isDirty },
    control,
    handleSubmit,
    reset,
  } = useForm<QuestionTemplate>();

  useEffect(() => {
    if (questionTemplate) {
      reset(questionTemplate);
    }
  }, [questionTemplate, reset]);

  const onSubmit = (data: QuestionTemplate) => {
    updateQuestionTemplate(data);
  };

  return (
    <form
      className="flex flex-row justify-between items-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <BackButton className="mb-2" href={`/dashboard/question`} />
        <input
          {...register("title")}
          disabled={isLoadingQuestionTemplate || isUpdatingQuestionTemplate}
          className="outline-none text-xl font-medium max-w-xl w-full md:w-xl"
          placeholder="Add question template title"
        />
      </div>
      <div className="flex flex-row gap-2">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {field.value && field.value.length ? (
                    <span>Tags: </span>
                  ) : (
                    <span>Add tag</span>
                  )}
                  {field.value?.length > 0 ? (
                    field.value?.length <= 2 ? (
                      field.value?.map((e) => (
                        <Badge key={e} variant="outline">
                          {e}
                        </Badge>
                      ))
                    ) : (
                      <>
                        <Badge variant="outline">{field.value[0]}</Badge>
                        <Badge variant="outline">{field.value[1]}</Badge>
                        <Badge variant="outline">
                          +{field.value.length - 2}
                        </Badge>
                      </>
                    )
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <TagsInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add a tag"
                  className="max-w-md"
                />
                <Label className="text-xs text-muted-foreground">
                  Press enter to add a tag
                </Label>
              </PopoverContent>
            </Popover>
          )}
        />
        <DialogAddQuestion
          referenceId={templateId}
          onSuccessCreateQuestion={(questions) => {
            setSelectedEditQuestion(questions[0]);
            setLocalQuestions((prev) => [...prev, ...questions]);
          }}
          order={totalQuestions + 1}
          referenceType="template"
        />
        <Button
          disabled={
            !isDirty || isLoadingQuestionTemplate || isUpdatingQuestionTemplate
          }
          type="submit"
        >
          {isUpdatingQuestionTemplate ? "Saving..." : "Save"}
        </Button>
        <DialogDeleteQuestionTemplate
          templateId={templateId}
          onSuccess={() => {
            router.push("/dashboard/question");
          }}
        />
      </div>
    </form>
  );
};

export default Header;
