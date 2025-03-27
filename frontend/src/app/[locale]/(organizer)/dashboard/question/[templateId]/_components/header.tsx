import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { $api } from "@/lib/api";
import { useQuestionTemplateById } from "@/query/organization/question/use-question-template-by-id";
import { QuestionTemplate } from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
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
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Header = ({ templateId }: { templateId: string }) => {
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
      <div className="flex flex-col gap-2">
        <BackButton href={`/dashboard/question`} className="w-max"/>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <input
              value={field.value || ""}
              onChange={field.onChange}
              disabled={isLoadingQuestionTemplate || isUpdatingQuestionTemplate}
              className="outline-none text-xl font-medium max-w-xl w-full md:w-xl"
              placeholder="Add question template title"
            />
          )}
        />
        {isDirty ? (
          <Button
            disabled={
              !isDirty ||
              isLoadingQuestionTemplate ||
              isUpdatingQuestionTemplate
            }
            className="w-max"
            type="submit"
            size={"sm"}
          >
            {isUpdatingQuestionTemplate ? "Saving..." : "Save"}
          </Button>
        ) : null}
      </div>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            You can use this template on a test detail page
          </TooltipContent>
        </Tooltip>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-1" size={"sm"}>
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
