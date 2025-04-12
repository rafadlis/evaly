import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  GripVertical,
  Loader2,
  Trash2,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DialogClose } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Editor } from "@/components/shared/editor/editor";
import { Separator } from "@/components/ui/separator";
import { Question, UpdateQuestion } from "@evaly/backend/types/question";
import { useUpdateQuestionMutation } from "@/query/organization/question/use-update-question.mutation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Reorder, useDragControls } from "motion/react";
import { Input } from "@/components/ui/input";
import { getDefaultOptions } from "@/lib/get-default-options";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerNavbar,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

const MAX_QUESTION_LENGTH = 3000;
const MIN_QUESTION_LENGTH = 10;

const DialogEditQuestion = ({
  defaultValue,
  onSuccess,
  onClose,
}: {
  defaultValue?: Question | null;
  onSuccess?: (question: Question) => void;
  onClose?: () => void;
}) => {
  const t = useTranslations("Questions");
  const tCommon = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [questionTextLength, setQuestionTextLength] = useState(0);

  const { mutateAsync: updateQuestion, isPending: isPendingUpdateQuestion } =
    useUpdateQuestionMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm<UpdateQuestion>({
    reValidateMode: "onChange",
  });
  const [type, updatedAt, allowMultipleAnswers, options] = watch([
    "type",
    "updatedAt",
    "allowMultipleAnswers",
    "options",
  ]);
  const isOptionsType = type === "multiple-choice" || type === "yes-or-no";

  // Validate options
  const validateOptions = () => {
    if (!isOptionsType || !options) return true;

    // Check if there are at least 2 options for multiple-choice questions
    if (options.length < 2) {
      return "At least 2 options are required";
    }

    // Check if at least one option is marked as correct
    const correctOptions = options.filter((option) => option.isCorrect);
    if (correctOptions.length === 0) {
      return "At least one option must be marked as correct";
    }

    // For multiple-choice with allowMultipleAnswers, not all options should be correct
    if (allowMultipleAnswers && correctOptions.length === options.length) {
      return "Not all options can be marked as correct in multiple-choice questions";
    }

    // Check if all options have text content
    const emptyOptions = options.filter(
      (option) => !option.text || option.text.trim() === ""
    );
    if (emptyOptions.length > 0) {
      return "All options must have text content";
    }

    // Check for duplicate option values
    const optionTexts = options.map((option) =>
      option.text?.trim().toLowerCase()
    );
    const uniqueOptionTexts = new Set(optionTexts.filter((text) => text)); // Filter out empty strings
    if (uniqueOptionTexts.size < optionTexts.filter((text) => text).length) {
      return "All options must have unique values";
    }

    return true;
  };

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
      setOpen(true);
    } else {
      onClose?.();
      setOpen(false);
    }
  }, [defaultValue, reset, onClose]);

  const onSubmit = async (data: UpdateQuestion, saveAndClose?: boolean) => {
    if (!defaultValue?.id) return;

    // Validate options
    if (isOptionsType && data.options) {
      // Check if there are at least 2 options for multiple-choice questions
      if (data.options.length < 2) {
        alert("At least 2 options are required");
        return;
      }

      // Check if at least one option is marked as correct
      const correctOptions = data.options.filter((option) => option.isCorrect);
      if (correctOptions.length === 0) {
        alert("At least one option must be marked as correct");
        return;
      }

      // For multiple-choice with allowMultipleAnswers, not all options should be correct
      if (
        data.allowMultipleAnswers &&
        correctOptions.length === data.options.length
      ) {
        alert(
          "Not all options can be marked as correct in multiple-choice questions"
        );
        return;
      }

      // Check if all options have text content
      const emptyOptions = data.options.filter(
        (option) => !option.text || option.text.trim() === ""
      );
      if (emptyOptions.length > 0) {
        alert("All options must have text content");
        return;
      }

      // Check for duplicate option values
      const optionTexts = data.options.map((option) =>
        option.text?.trim().toLowerCase()
      );
      const uniqueOptionTexts = new Set(optionTexts.filter((text) => text)); // Filter out empty strings
      if (uniqueOptionTexts.size < optionTexts.filter((text) => text).length) {
        alert("All options must have unique values");
        return;
      }
    }

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
      direction="bottom"
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          closeDialog(isDirty);
        } else {
          setOpen(true);
        }
      }}
    >
      <DrawerContent className="sm:max-w-none h-dvh flex flex-col p-0 gap-0">
        <DrawerNavbar
          onBack={() => closeDialog(isDirty)}
          title={`Edit Question #${defaultValue?.order}`}
          className="mb-10"
        />

        <div className="flex flex-col overflow-y-auto pb-10">
          <DrawerHeader className="container max-w-4xl px-6">
            <DrawerTitle className="flex justify-between items-center">
              <div className="flex flex-row gap-2 items-center">
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <QuestionTypeSelection
                      size={"sm"}
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value);

                        // if the question type is changed, then reset the options with the default options of the new question type
                        const defaultOptions = getDefaultOptions(value);
                        if (defaultOptions) {
                          setValue("options", defaultOptions);
                          setValue("allowMultipleAnswers", false);
                          clearErrors();
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="pointValue"
                  rules={{
                    validate: (value) => {
                      if (
                        typeof value === "number" &&
                        (value == 0 || value > 100)
                      ) {
                        return "Point value must be between 0 and 100";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) =>
                    typeof field.value === "number" ? (
                      <div className="flex flex-row gap-2 items-center relative">
                        <Label className="absolute left-2.5 text-xs text-muted-foreground/80 pt-0.5">
                          {t("point")}
                        </Label>
                        <Input
                          type="number"
                          className={cn(
                            "w-28 pl-12 h-7",
                            errors.pointValue ? "border-destructive" : ""
                          )}
                          min={0}
                          max={100}
                          placeholder="0"
                          value={
                            field.value === 0 && !field.value ? "" : field.value
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                        <Button
                          variant={"ghost"}
                          size={"icon-xxs"}
                          className="absolute right-1"
                          onClick={() => {
                            setValue("pointValue", null, { shouldDirty: true });
                          }}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          field.onChange(5);
                        }}
                        variant={"secondary"}
                        size={"sm"}
                      >
                        {t("addPoint")}
                      </Button>
                    )
                  }
                />
                {errors.pointValue && (
                  <span className="text-xs text-destructive">
                    {errors.pointValue.message}
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-2 text-muted-foreground font-normal text-sm">
                {t("lastUpdated")}: {dayjs(updatedAt).fromNow()}
              </div>
            </DrawerTitle>
          </DrawerHeader>

          <div className="container max-w-4xl pb-10 pt-2">
            <Controller
              control={control}
              name="question"
              rules={{
                validate: () => {
                  if (questionTextLength < MIN_QUESTION_LENGTH) {
                    return `Question text must be at least ${MIN_QUESTION_LENGTH} characters`;
                  }
                  if (questionTextLength > MAX_QUESTION_LENGTH) {
                    return `Question text must be less than ${MAX_QUESTION_LENGTH} characters`;
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <>
                  <Editor
                    onContentLengthChange={setQuestionTextLength}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Type your question here..."
                    editorClassName={cn(
                      errors.question ? "border-destructive" : ""
                    )}
                    toolbarClassName={cn(
                      "sticky top-0",
                      errors.question ? "border-destructive" : ""
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs text-muted-foreground mt-2",
                      errors.question ? "text-destructive" : ""
                    )}
                  >
                    <span>
                      {questionTextLength} / {MAX_QUESTION_LENGTH}
                    </span>
                    {errors.question ? (
                      <span className="ml-2">- {errors.question?.message}</span>
                    ) : null}
                  </span>
                </>
              )}
            />

            {isOptionsType ? (
              <div className="mt-8 mb-6 flex flex-row items-center gap-2">
                <Label className="text-sm text-muted-foreground">
                  {t("selectCorrectAnswer")}
                </Label>
                <Separator className="flex-1" />
                {options && options?.length > 2 ? (
                  <div className="flex flex-row items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      {t("allowMultipleAnswers")}
                    </Label>
                    <Switch
                      checked={allowMultipleAnswers === true}
                      onCheckedChange={(value) => {
                        if (
                          value === false &&
                          (options?.filter((option) => option.isCorrect)
                            .length || 0) > 1
                        ) {
                          setValue(
                            "options",
                            options?.map((option) => ({
                              ...option,
                              isCorrect: false,
                            })),
                            { shouldDirty: true }
                          );
                        }
                        setValue("allowMultipleAnswers", value);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {isOptionsType ? (
              <Controller
                control={control}
                name="options"
                rules={{
                  validate: validateOptions,
                }}
                render={({ field }) => (
                  <>
                    <Options
                      value={field.value || []}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      type={type}
                      allowMultipleAnswers={allowMultipleAnswers === true}
                    />
                    {errors.options && (
                      <span className="text-xs text-destructive mt-2">
                        {errors.options.message}
                      </span>
                    )}
                  </>
                )}
              />
            ) : null}
          </div>
        </div>

        <DialogFooter className="border-t px-0 py-3 border-dashed fixed bottom-0 left-0 right-0 bg-background">
          <div className="flex flex-row justify-between w-full z-50 container max-w-4xl">
            <div className="flex flex-row gap-2">
              <DialogClose asChild>
                <Button variant={"secondary"}>{tCommon("backButton")}</Button>
              </DialogClose>
              {isDirty ? (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    if (defaultValue) {
                      reset(defaultValue);
                    }
                  }}
                >
                  {tCommon("resetButton")}
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
                  {tCommon("saveAndCloseButton")}
                </Button>
              ) : null}
              <Button
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isPendingUpdateQuestion || !isDirty}
              >
                {isPendingUpdateQuestion ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                {tCommon("saveButton")}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Options = ({
  value,
  onChange,
  allowMultipleAnswers,
  type,
}: {
  value: UpdateQuestion["options"];
  onChange: (options: UpdateQuestion["options"]) => void;
  allowMultipleAnswers: boolean;
  type: UpdateQuestion["type"];
}) => {
  const t = useTranslations("Questions");
  const onChangeOption = (
    option: NonNullable<UpdateQuestion["options"]>[number]
  ) => {
    if (!value) return;
    onChange(value.map((item) => (item.id === option.id ? option : item)));
  };

  // Calculate validation states
  const correctOptionsCount =
    value?.filter((option) => option.isCorrect)?.length || 0;
  const hasNoCorrectOption = correctOptionsCount === 0;
  const allOptionsCorrect =
    value && value.length > 0 && correctOptionsCount === value.length;
  const hasEmptyOptions = value?.some(
    (option) => !option.text || option.text.trim() === ""
  );
  const hasTooFewOptions = value && value.length < 2;

  // Check for duplicate options
  const hasDuplicateOptions = (() => {
    if (!value) return false;
    const optionTexts = value
      .map((option) => option.text?.trim().toLowerCase())
      .filter((text) => text);
    const uniqueOptionTexts = new Set(optionTexts);
    return uniqueOptionTexts.size < optionTexts.length;
  })();

  const maxOptions =
    type === "multiple-choice" ? 5 : type === "yes-or-no" ? 2 : 0;

  if (!value) return null;

  return (
    <div className="flex flex-col gap-2">
      <Reorder.Group
        className="flex flex-col gap-2 mt-2 text-sm"
        onReorder={(newOrder) => {
          onChange(newOrder);
        }}
        values={value}
      >
        {value.map((option, i) => {
          // Check if this option is a duplicate
          const isDuplicate = !!(
            option.text &&
            option.text.trim() !== "" &&
            value.some(
              (o) =>
                o.id !== option.id &&
                o.text &&
                o.text.trim().toLowerCase() === option.text.trim().toLowerCase()
            )
          );

          return (
            <OptionItem
              option={option}
              index={i}
              onChange={(option) => {
                onChangeOption(option);
              }}
              onClickCorrect={() => {
                if (!allowMultipleAnswers) {
                  onChange(
                    value.map((item) => ({
                      ...item,
                      isCorrect:
                        item.id === option.id ? !option.isCorrect : false,
                    }))
                  );
                } else {
                  // For multiple-choice, toggle the current option's correctness without affecting others
                  onChange(
                    value.map((item) =>
                      item.id === option.id
                        ? { ...item, isCorrect: !item.isCorrect }
                        : item
                    )
                  );
                }
              }}
              key={option.id}
              onDelete={() => {
                onChange(value.filter((item) => item.id !== option.id));
              }}
              isDuplicate={isDuplicate}
            />
          );
        })}
      </Reorder.Group>

      {/* Add Option Button */}
      {value && value.length < maxOptions && (
        <div className="mt-4 mx-auto">
          <Button
            variant="outline"
            className="w-max border-dashed"
            onClick={() => {
              // Determine max options based on question type

              // Only add if we haven't reached the maximum
              if (value.length < maxOptions) {
                const newOption = {
                  id: nanoid(5),
                  text: "",
                  isCorrect: false,
                };
                onChange([...value, newOption]);
              }
            }}
          >
            {t("addOption")}
          </Button>
        </div>
      )}

      {/* Validation warnings */}
      {hasNoCorrectOption && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          {t("atLeastOneOptionMustBeMarkedAsCorrect")}
        </div>
      )}
      {allowMultipleAnswers && allOptionsCorrect && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          {t("notAllOptionsShouldBeMarkedAsCorrectInMultipleChoiceQuestions")}
        </div>
      )}
      {hasEmptyOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          {t("allOptionsMustHaveTextContent")}
        </div>
      )}
      {hasTooFewOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          {t("atLeastTwoOptionsAreRequired")}
        </div>
      )}
      {hasDuplicateOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          {t("allOptionsMustHaveUniqueValues")}
        </div>
      )}
    </div>
  );
};

const OptionItem = ({
  option,
  index,
  onChange,
  onClickCorrect,
  onDelete,
  isDuplicate,
}: {
  option: NonNullable<UpdateQuestion["options"]>[number];
  index: number;
  onChange: (options: NonNullable<UpdateQuestion["options"]>[number]) => void;
  onClickCorrect?: () => void;
  onDelete: () => void;
  isDuplicate?: boolean;
}) => {
  const t = useTranslations("Questions");
  const control = useDragControls();
  const isEmptyOption = !option.text || option.text.trim() === "";

  return (
    <Reorder.Item
      value={option}
      className="flex flex-row items-center gap-1"
      dragListener={false}
      dragControls={control}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            className="select-none mr-2"
            variant={option.isCorrect ? "success" : "secondary"}
            onClick={onClickCorrect}
          >
            {option.isCorrect ? (
              <CheckCircle2 className="size-5" />
            ) : (
              String.fromCharCode(65 + index)
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {option.isCorrect
            ? "This is the correct answer"
            : "Click to mark as correct answer"}
        </TooltipContent>
      </Tooltip>
      <div className="flex-1 flex flex-row items-center">
        <Input
          placeholder={`${t("typeOptions", { number: index + 1 })}`}
          className={cn(
            "bg-secondary border-transparent",
            isEmptyOption ? "border-destructive" : "",
            isDuplicate ? "border-amber-500 bg-warning" : ""
          )}
          value={option.text}
          onChange={(e) => {
            onChange({ ...option, text: e.target.value });
          }}
        />
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onPointerDown={(e) => control.start(e)}
              variant={"ghost"}
              size={"icon"}
            >
              <GripVertical className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("dragToReorderOptions")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"icon"} onClick={onDelete}>
              <Trash2 className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("deleteOption")}</TooltipContent>
        </Tooltip>
      </div>
    </Reorder.Item>
  );
};

export default DialogEditQuestion;
