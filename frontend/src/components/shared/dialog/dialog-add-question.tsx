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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  triggerButton,
}: {
  order?: number;
  referenceId: string;
  referenceType?: Question["referenceType"];
  onSuccessCreateQuestion?: (question: Question[]) => void;
  triggerButton?: React.ReactNode;
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
        {triggerButton ? (
          triggerButton
        ) : (
          <Button variant={"outline"} type="button">
            <Plus /> Add question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Select the question type you want to add
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="flex flex-row flex-wrap gap-3 w-full mt-2">
              {Object.values(questionTypes)
                .filter((e) => !e.isHidden)
                .map((type) => (
                  <Button
                    key={type.value}
                    variant={"secondary"}
                    className="group"
                    size={"sm"}
                    disabled={
                      type.isHidden ||
                      (isPendingCreateQuestion && typeSelected === type.value)
                    }
                    onClick={() =>
                      handleCreateQuestion(type.value as QuestionType)
                    }
                  >
                    {type.isHidden ? (
                      <LockIcon size={14} />
                    ) : isPendingCreateQuestion &&
                      typeSelected === type.value ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <type.icon className="size-4" />
                    )}
                    {type.label}
                    {/* <ArrowRight className="size-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-0 group-hover:scale-100" /> */}
                  </Button>
                ))}
            </div>
          </TabsContent>
        </Tabs>
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
