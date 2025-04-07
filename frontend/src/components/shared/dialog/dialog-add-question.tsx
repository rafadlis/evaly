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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { questionTypes } from "@/constants/question-type";
import { $api } from "@/lib/api";
import { getDefaultOptions } from "@/lib/get-default-options";
import { InsertQuestion } from "@evaly/backend/types/question";
import { Question, QuestionType } from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import {
  FileTextIcon,
  Loader2,
  LockIcon,
  PencilIcon,
  Plus,
  SparklesIcon,
  UploadIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import GenerateQuestionInputPrompt from "../generate-question-input-prompt";

const DialogAddQuestion = ({
  order = 1,
  referenceId,
  referenceType,
  onSuccessCreateQuestion,
  triggerButton,
  showTabsOption = true,
}: {
  order?: number;
  referenceId: string;
  referenceType?: Question["referenceType"];
  onSuccessCreateQuestion?: (question: Question[]) => void;
  triggerButton?: React.ReactNode;
  showTabsOption?: boolean;
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

  const groupedQuestionTypes = useMemo(() => {
    return Object.values(questionTypes).reduce(
      (acc, type) => {
        const group = type.group || "Other"; // Default group if missing
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(type);
        return acc;
      },
      {} as Record<string, (typeof questionTypes)[keyof typeof questionTypes][]>
    );
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button variant={"outline"} type="button" className="w-max">
            <Plus /> Add question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-none h-dvh flex flex-col p-0">
        <div className="container max-w-2xl overflow-y-auto pt-[14vh] pb-20">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>
              Select the question type you want to add
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="manual" className="mt-4 space-y-6">
            {showTabsOption ? (
              <TabsList className="divide-x gap-0 divide-dashed divide-foreground/5">
                <TabsTrigger value="manual">
                  <PencilIcon className="size-4" /> Manual
                </TabsTrigger>
                <TabsTrigger value="import">
                  <UploadIcon className="size-4" /> Import
                </TabsTrigger>
                <TabsTrigger value="template">
                  <FileTextIcon className="size-4" /> Template
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <SparklesIcon className="size-4" /> AI
                </TabsTrigger>
              </TabsList>
            ) : null}

            <TabsContent value="manual">
              <div className="space-y-6">
                {Object.entries(groupedQuestionTypes).map(([group, types]) => (
                  <div key={group} className="">
                    <Label>{group}</Label>
                    <div className="flex flex-wrap gap-3 w-full mt-2">
                      {types.map((type) => (
                        <Button
                          key={type.value}
                          variant={"secondary"}
                          size={"sm"}
                          className="group justify-start"
                          disabled={
                            type.isHidden ||
                            (isPendingCreateQuestion &&
                              typeSelected === type.value)
                          }
                          onClick={() =>
                            handleCreateQuestion(type.value as QuestionType)
                          }
                        >
                          {type.isHidden ? (
                            <LockIcon className="size-3.5" />
                          ) : isPendingCreateQuestion &&
                            typeSelected === type.value ? (
                            <Loader2 className="animate-spin size-4" />
                          ) : (
                            <type.icon className="size-4" />
                          )}
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="import">
              <div className="border border-dashed p-4 flex flex-col">
                <Label className="font-semibold mb-2">Import Questions</Label>
                <Label className="mb-4">
                  Upload document to generate questions
                </Label>
                <div className="flex flex-row gap-2">
                  <Input
                    type="file"
                    className="mt-2"
                    accept=".pdf,.xlsx,.xls,.csv,.json"
                  />
                  <Button className="mt-2">Import</Button>
                </div>
                <div className="text-sm text-muted-foreground mt-4 space-x-2">
                  <span>Supported formats:</span>
                  <span>.pdf, .xlsx, .xls, .csv, .json</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template">
              <div className="border border-dashed p-4 flex flex-col">
                <Label className="font-semibold mb-2">Use Template</Label>
                <Label className="mb-4">
                  Upload a template Excel file with questions
                </Label>
                <div className="flex flex-row gap-2">
                  <Input type="file" className="mt-2" accept=".xlsx,.xls" />
                  <Button className="mt-2">Upload</Button>
                </div>
                <div className="mt-4">
                  <Button variant="link" size="sm" className="p-0">
                    Download template Excel
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download our template Excel to create questions based on our
                    format
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <div className="max-w-2xl w-full">
                <GenerateQuestionInputPrompt />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="fixed bottom-0 left-0 right-0 border-t border-dashed bg-background">
          <DialogFooter className="sm:justify-start mt-0 py-4 container max-w-2xl">
            <DialogClose asChild>
              <Button variant={"outline"}>Back</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddQuestion;
