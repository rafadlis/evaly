import { Button } from "@/components/ui/button";
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
  QuestionType,
  UpdateQuestion,
} from "@evaly/backend/types/question";
import { useUpdateQuestionMutation } from "@/query/organization/question/use-update-question.mutation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Reorder, useDragControls } from "motion/react";
import { Input } from "@/components/ui/input";
import { getDefaultOptions } from "@/lib/get-default-options";

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
    setValue,
    formState: { isDirty },
  } = useForm<UpdateQuestion>();

  const type = watch("type");
  const updatedAt = watch("updatedAt");
  const isOptionsType =
    type === "multiple-choice" ||
    type === "yes-or-no" ||
    type === "single-choice" ||
    type === "point-based";

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
                    onValueChange={(value) => {
                      field.onChange(value);

                      // if the question type is changed, then reset the options with the default options of the new question type
                      const defaultOptions = getDefaultOptions(value);
                      if (defaultOptions) {
                        setValue("options", defaultOptions);
                      }
                    }}
                  />
                )}
              />
              <div className="flex flex-row gap-2 text-muted-foreground font-normal text-sm">
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

            {isOptionsType ? (
              <div className="mt-8 mb-6 flex flex-row items-center gap-2">
                <Separator className="max-w-4" />
                <span className="text-sm text-muted-foreground">
                  {type === "multiple-choice"
                    ? "You can select multiple correct answers"
                    : "Select the correct answer"}
                </span>
                <Separator className="flex-1" />
              </div>
            ) : null}

            {isOptionsType ? (
              <Controller
                control={control}
                name="options"
                render={({ field }) => (
                  <Options
                    value={field.value || []}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    type={type}
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

const Options = ({
  value,
  onChange,
  type,
}: {
  value: UpdateQuestion["options"];
  onChange: (options: UpdateQuestion["options"]) => void;
  type: QuestionType;
}) => {

  const onChangeOption = (
    option: NonNullable<UpdateQuestion["options"]>[number]
  ) => {
    if (!value) return;
    onChange(value.map((item) => (item.id === option.id ? option : item)));
  };

  if (!value) return null;
  return (
    <Reorder.Group
      className="flex flex-col gap-4 mt-2 text-sm"
      onReorder={(newOrder) => {
        onChange(newOrder);
      }}
      values={value}
    >
      {value.map((option, i) => (
        <OptionItem
          option={option}
          index={i}
          onChange={(option) => {
            onChangeOption(option);
          }}
          onClickCorrect={() => {
            // if the question type is single-choice or point-based, then only one option can be correct, other options will be incorrect
            if (type === "single-choice" || type === "point-based" || type === "yes-or-no") {
              onChange(
                value.map((item) => ({
                  ...item,
                  isCorrect: item.id === option.id ? !option.isCorrect : false
                }))
              );
            } else {
              // For multiple-choice, toggle the current option's correctness without affecting others
              onChange(
                value.map((item) =>
                  item.id === option.id ? { ...item, isCorrect: !item.isCorrect } : item
                )
              );
            }
          }}
          key={option.id}
          onDelete={() => {
            onChange(value.filter((item) => item.id !== option.id));
          }}
        />
      ))}
    </Reorder.Group>
  );
};

const OptionItem = ({
  option,
  index,
  onChange,
  onClickCorrect,
  onDelete,
}: {
  option: NonNullable<UpdateQuestion["options"]>[number];
  index: number;
  onChange: (options: NonNullable<UpdateQuestion["options"]>[number]) => void;
  onClickCorrect?: () => void;
  onDelete: () => void;
}) => {
  const control = useDragControls();

  return (
    <Reorder.Item
      value={option}
      className="flex flex-row items-center gap-1"
      dragListener={false}
      dragControls={control}
    >
      <div className="flex-1 relative flex flex-row items-center">
        <Button
          size={"icon-xs"}
          className="absolute left-2 select-none"
          variant={option.isCorrect ? "default" : "secondary"}
          rounded={false}
          onClick={onClickCorrect}
        >
          {String.fromCharCode(65 + index)}
        </Button>
        <Input
          placeholder={`Type options ${index + 1}`}
          className="pl-12 h-10"
          value={option.text}
          onChange={(e) => {
            onChange({ ...option, text: e.target.value });
          }}
        />
      </div>
      <div>
        <Button
          onPointerDown={(e) => control.start(e)}
          rounded={false}
          variant={"ghost"}
          size={"icon-sm"}
        >
          <GripVertical className="text-muted-foreground" />
        </Button>
        <Button
          rounded={false}
          variant={"ghost"}
          size={"icon-sm"}
          onClick={onDelete}
        >
          <Trash2 className="text-muted-foreground" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

export default DialogEditQuestion;
