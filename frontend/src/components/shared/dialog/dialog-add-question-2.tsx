import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { questionTypes } from "@/constants/question-type";
import { $api } from "@/lib/api";
import { getDefaultOptions } from "@/lib/get-default-options";
import { InsertQuestion } from "@evaly/backend/types/question";
import { Question, QuestionType } from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LockIcon, Plus } from "lucide-react";
import { useState } from "react";

const DialogAddQuestion = ({
  order = 1,
  referenceId,
  referenceType,
  onSuccessCreateQuestion,
}: {
  order?: number;
  referenceId: string;
  referenceType?: Question["referenceType"];
  onSuccessCreateQuestion?: (question: Question[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typeSelected, setTypeSelected] = useState<QuestionType>();

  const { mutate: mutateCreateQuestion, isPending: isPendingCreateQuestion } =
    useMutation({
      mutationKey: ["create-question"],
      mutationFn: async () => {
        const question: InsertQuestion = {
          referenceId,
          order,
          type: typeSelected,
          referenceType: referenceType,
        };

        if (
          typeSelected === "multiple-choice" ||
          typeSelected === "yes-or-no"
        ) {
          question.options = getDefaultOptions(typeSelected);
        }

        // Currently we only support single question creation, but its ready for bulk creation
        const response = await $api.organization.question.create.post([
          question,
        ]);

        if (response.status !== 200) {
          throw new Error(response.error?.value as unknown as string);
        }

        return response.data?.questions;
      },
      onSuccess(data) {
        if (data?.length) {
          onSuccessCreateQuestion?.(data);
        }
      },
      onSettled() {
        setTypeSelected(undefined);
        setIsOpen(false);
      },
    });

  const handleCreateQuestion = (type: QuestionType) => {
    if (!order) return;
    setTypeSelected(type);
    mutateCreateQuestion();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline-solid"}>
          <Plus /> Add question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Select the question type you want to add
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row flex-wrap gap-y-3 gap-x-2 w-full mt-2">
          {Object.values(questionTypes)
            .filter((e) => !e.isHidden)
            .map((type) => (
              <Button
                key={type.value}
                variant={"secondary"}
                className="group"
                disabled={
                  type.isHidden ||
                  (isPendingCreateQuestion && typeSelected === type.value)
                }
                onClick={() => handleCreateQuestion(type.value as QuestionType)}
              >
                {type.isHidden ? (
                  <LockIcon />
                ) : isPendingCreateQuestion && typeSelected === type.value ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <type.icon className="size-5" />
                )}
                {type.label}
                {/* <ArrowRight className="size-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-0 group-hover:scale-100" /> */}
              </Button>
            ))}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant={"outline"}>Back</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddQuestion;
