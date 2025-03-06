import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Drawer,
  DrawerHeader,
  DrawerNavbar,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DrawerContent } from "@/components/ui/drawer";
import { DrawerClose } from "@/components/ui/drawer";
import { DrawerFooter } from "@/components/ui/drawer";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Editor } from "@/components/shared/editor/editor";
import { Separator } from "@/components/ui/separator";
import {
  Question,
  UpdateQuestion,
  UpdateQuestionOption,
  UpdateQuestionWithOptions,
} from "@evaly/backend/types";
import { useUpdateQuestionMutation } from "@/query/organization/question/use-update-question.mutation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Reorder } from "motion/react";

dayjs.extend(relativeTime);

const DialogEditQuestion = ({
  defaultValue,
  onSuccess,
  onClose,
}: {
  defaultValue?: Question | null;
  onSuccess?: (question: Question) => void;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: updateQuestion, isPending: isPendingUpdateQuestion } =
    useUpdateQuestionMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<UpdateQuestion | UpdateQuestionWithOptions>();

  const type = watch("type");
  const updatedAt = watch("updatedAt");

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
      setOpen(true);
    } else {
      setOpen(false);
      onClose?.();
    }
  }, [defaultValue, reset, onClose]);

  const onSubmit = async (data: UpdateQuestion | UpdateQuestionWithOptions, saveAndClose?: boolean) => {
    if (!defaultValue?.id) return;

    const updatedQuestion = await updateQuestion(data);

    if (updatedQuestion) {
      onSuccess?.(updatedQuestion);
    }

    if (saveAndClose) {
      closeDialog(!updatedQuestion); // if the question is not updated, then the dialog is not dirty
    }
  };

  const closeDialog = (isDirty?: boolean) => {
    if (isDirty) {
      const confirmed = window.confirm(
        "Are you sure you want to close? Any unsaved changes will be lost."
      );
      if (!confirmed) return;
      setOpen(false);
      onClose?.();
    } else {
      setOpen(false);
      onClose?.();
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          closeDialog(isDirty);
        } else {
          setOpen(true);
        }
      }}
      handleOnly
    >
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => closeDialog(isDirty)}
          title={`Edit Question #${defaultValue?.order}`}
        />

        <div className="flex flex-col overflow-y-auto">
          <DrawerHeader className="pt-10 container max-w-4xl px-6">
            <DrawerTitle className="flex justify-between items-center">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <QuestionTypeSelection
                    size={"default"}
                    variant={"outline-solid"}
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  />
                )}
              />
              <div className="flex flex-row gap-2 text-muted-foreground font-normal">
                Last updated: {dayjs(updatedAt).fromNow()}
              </div>
            </DrawerTitle>
          </DrawerHeader>

          <div className="container max-w-4xl pb-10">
            <Controller
              control={control}
              name="question"
              render={({ field }) => (
                <Editor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Type your question here..."
                />
              )}
            />

            <Separator className="my-6" />
            {type === "multiple-choice" ? (
              <Controller
                control={control}
                name="options"
                render={({ field }) => (
                  <MultipleChoiceAnswer
                    value={field.value || []}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
            ) : null}
          </div>
        </div>

        <DrawerFooter className="border-t px-0">
          <div className="flex flex-row justify-between w-full z-50 container max-w-4xl">
            <div className="flex flex-row gap-2">
              <DrawerClose asChild>
                <Button variant={"secondary"}>Back</Button>
              </DrawerClose>
              {isDirty ? (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    if (defaultValue) {
                      reset(defaultValue);
                    }
                  }}
                >
                  Reset
                </Button>
              ) : null}
            </div>
            <div className="flex flex-row gap-2">
              {isDirty ? (
                <Button
                  variant={"ghost"}
                  onClick={handleSubmit((data) => onSubmit(data, true))}
                  disabled={isPendingUpdateQuestion || !isDirty}
                >
                  {isPendingUpdateQuestion ? (
                    <Loader2 className="animate-spin" />
                  ) : null}
                  Save & Close
                </Button>
              ) : null}
              <Button
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isPendingUpdateQuestion || !isDirty}
              >
                {isPendingUpdateQuestion ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Save
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const MultipleChoiceAnswer = ({
  value,
  onChange,
}: {
  value: UpdateQuestionOption[];
  onChange: (options: UpdateQuestionOption[]) => void;
}) => {
  return (
    <Reorder.Group
      className="flex flex-col gap-4 mt-2 text-sm"
      onReorder={(newOrder) => {
        onChange(newOrder);
      }}
      values={value}
    >
      {value.map((option, i) => (
        <Reorder.Item
          key={option.id}
          value={option}
          className="flex flex-row items-center gap-1"
          dragListener={false}
        >
          <div className="flex-1 relative flex flex-row items-center">
            <Button
              size={"icon-xs"}
              className="absolute left-2 select-none"
              variant={option.isCorrect ? "default" : "secondary"}
              rounded={false}
              onClick={() => {
                onChange(
                  value.map((item) => {
                    if (item.id === option.id) {
                      return { ...item, isCorrect: !item.isCorrect };
                    }
                    return item;
                  })
                );
              }}
            >
              {String.fromCharCode(65 + i)}
            </Button>
            <Input
              placeholder={`Type options ${i + 1}`}
              className="pl-12 h-10"
              value={option.text}
              onChange={(e) => {
                onChange(
                  value.map((item) => {
                    if (item.id === option.id) {
                      return { ...item, text: e.target.value };
                    }
                    return item;
                  })
                );
              }}
            />
          </div>
          <div>
            <Button rounded={false} variant={"ghost"} size={"icon-sm"}>
              <GripVertical className="text-muted-foreground" />
            </Button>
            <Button rounded={false} variant={"ghost"} size={"icon-sm"}>
              <Trash2 className="text-muted-foreground" />
            </Button>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default DialogEditQuestion;
