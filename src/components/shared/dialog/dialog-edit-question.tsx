import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GripVertical, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionTypeSelection from "../question-type-selection";
import { Separator } from "@/components/ui/separator";
import { Editor } from "../editor/editor";
import { trpc } from "@/trpc/trpc.client";
import { Controller, useForm } from "react-hook-form";
import { Question, UpdateQuestion } from "@/lib/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          closeDialog(isDirty);
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogContent className="lg:min-w-3xl">
        <ScrollArea className="max-h-[calc(100vh-200px)]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-start">
            <span>Edit Question</span>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <QuestionTypeSelection
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                />
              )}
            />
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="mt-2">
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

        <DialogFooter className="sticky bottom-0">
          <div className="flex flex-row justify-between w-full">
            <DialogClose asChild>
              <Button variant={"secondary"}>Back</Button>
            </DialogClose>
            <div className="flex flex-row gap-2">
              <Button
                variant={"outline"}
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={isPendingUpdateQuestion || !isDirty}
              >
                {isPendingUpdateQuestion ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Save & Close
              </Button>
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
        </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};


const MultipleChoiceAnswer = () => {
  return (
    <div className="flex flex-col gap-4 mt-2 text-sm">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-row items-center gap-1">
                <Button rounded={false} variant={"ghost"} size={"icon-sm"}>
                  <GripVertical className="text-muted-foreground" />
                </Button>
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
              </div>
            ))}
          </div>
  );
};

export default DialogEditQuestion;
