import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/trpc.client";
import { Controller, useForm } from "react-hook-form";
import { Question, UpdateQuestion } from "@/lib/db/schema/question";
import {
    Drawer,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "../../ui/drawer";
import { DrawerContent } from "../../ui/drawer";
import { DrawerClose } from "../../ui/drawer";
import { DrawerFooter } from "../../ui/drawer";
import QuestionTypeSelection from "../question-type-selection";
import { Editor } from "../editor/editor";
import { Separator } from "@/components/ui/separator";

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
    trpc.organization.question.update.useMutation({});

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<UpdateQuestion>();

  const type = watch("type");

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
      setOpen(true);
    } else {
      setOpen(false);
      onClose?.();
    }
  }, [defaultValue, reset, onClose]);

  const onSubmit = async (data: UpdateQuestion, saveAndClose?: boolean) => {
    if (!defaultValue?.id) return;

    const updatedQuestion = await updateQuestion({
      questionId: defaultValue?.id,
      data: data,
    });

    if (updatedQuestion.length > 0) {
      onSuccess?.(updatedQuestion[0]);
    }

    if (saveAndClose) {
      closeDialog(updatedQuestion.length === 0); // if the question is not updated, then the dialog is not dirty
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
      <DrawerContent className="h-[80vh]">
        <div className="flex flex-col container max-w-3xl pb-10 overflow-y-auto hide-scrollbar">
          <DrawerHeader>
            <DrawerTitle className="flex justify-between items-start">
              <span>Edit Question</span>
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
            </DrawerTitle>
            <DrawerDescription className="hidden"></DrawerDescription>
          </DrawerHeader>

          <div className="mt-2 px-1">
            <Controller
              control={control}
              name="question"
              render={({ field }) => (
                <Editor value={field.value || ""} onChange={field.onChange} />
              )}
            />

            <Separator className="my-6" />
            {type === "multiple-choice" ? <MultipleChoiceAnswer /> : null}
          </div>
        </div>

        <DrawerFooter className="border-t px-0">
          <div className="flex flex-row justify-between w-full z-50 container max-w-3xl">
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

const MultipleChoiceAnswer = () => {
  return (
    <div className="flex flex-col gap-4 mt-2 text-sm">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-row items-center gap-1">
          <div className="flex-1 relative flex flex-row items-center">
            <Button
              size={"icon-xs"}
              className="absolute left-2 select-none"
              variant={i == 2 ? "default" : "secondary"}
              rounded={false}
            >
              A
            </Button>
            <Input
              placeholder={`Type options ${i + 1}`}
              className="pl-12 h-10"
            />
          </div>
          <Button rounded={false} variant={"ghost"} size={"icon-sm"}>
            <GripVertical className="text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DialogEditQuestion;
