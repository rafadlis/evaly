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
import { Textarea } from "@/components/ui/textarea";
import { questionTypes } from "@/constants/question-type";
import { $api } from "@/lib/api";
import { getDefaultOptions } from "@/lib/get-default-options";
import { cn } from "@/lib/utils";
import { InsertQuestion } from "@evaly/backend/types/question";
import { Question, QuestionType } from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import {
  FileSpreadsheet,
  FileText,
  FileTextIcon,
  ImageIcon,
  Loader2,
  LockIcon,
  Paperclip,
  PencilIcon,
  Plus,
  SparklesIcon,
  UploadIcon,
  VideoIcon,
  Wand2Icon,
} from "lucide-react";
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
      <DialogContent className="sm:max-w-none h-dvh flex flex-col pt-[30vh]">
        <div className="container max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>
              Select the question type you want to add
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="manual" className="mt-4">
            <TabsList className="mb-4 w-full grid grid-cols-4 divide-x gap-0 divide-dashed divide-foreground/10">
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
            <TabsContent value="manual">
              <div className="flex flex-row flex-wrap gap-2 w-full">
                {Object.values(questionTypes)
                  .filter((e) => !e.isHidden)
                  .map((type) => (
                    <Button
                      key={type.value}
                      variant={"outline"}
                      className="group"
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
            <TabsContent value="import">
              <div className="border border-dashed p-4">
                <Label className="font-medium text-md">Import Questions</Label>
                <p className="text-muted-foreground text-sm mb-2">
                  Upload a document file with questions
                </p>
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
              <div className="border border-dashed p-4">
                <Label className="font-medium text-md">Use Template</Label>
                <p className="text-muted-foreground text-sm mb-2">
                  Upload a template Excel file with questions
                </p>
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
                <div className="relative">
                  <Textarea
                    autoFocus
                    // value={inputValue}
                    // onChange={(e) => setInputValue(e.target.value)}
                    // onKeyDown={handleKeyDown}
                    placeholder="Enter prompt or paste content to generate questions..."
                    className={cn(
                      "w-full h-[120px] overflow-clip text-sm md:text-base p-4 [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:border-foreground/20 shadow-none transition-all duration-200"
                    )}
                  />
                  <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-between w-full">
                    <div className="flex flex-row gap-2 items-center justify-center"></div>
                    <div className="flex flex-row items-center justify-center gap-1">
                      <Button size={"icon-sm"} variant={"ghost"} disabled>
                        <Wand2Icon />
                      </Button>
                      <Button size={"icon-sm"} variant={"ghost"}>
                        <Paperclip />
                      </Button>
                      <Button
                        size={"icon-sm"}
                        // variant={inputValue.trim() ? "default" : "secondary-outline"}
                        // onClick={handleSubmit}
                        // disabled={isPending || !inputValue.trim() || isGenerating}
                      >
                        {/* {isPending || isGenerating ? (
                    <Loader2 className="size-4 stroke-3 text-muted-foreground animate-spin" />
                  ) : (
                    <ArrowRight className="size-4 stroke-3" />
                  )} */}
                      </Button>
                    </div>
                  </div>
                  {/* <AnimatePresence>
              {autoComplete.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="z-10 absolute top-[120px] bg-background w-full border border-foreground/20 border-t-border rounded-b-2xl p-2"
                >
                  <ScrollArea className="h-[200px] flex flex-col gap-2">
                    {autoComplete.map((item, index) => (
                      <Button
                        key={index}
                        variant={"ghost"}
                        className="w-full justify-start gap-3"
                      >
                        <SearchIcon className="text-muted-foreground size-4" />
                        <span>{item}</span>
                      </Button>
                    ))}
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence> */}
                </div>
                <div className="flex flex-row gap-x-2 gap-y-4 flex-wrap justify-start mt-4">
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    rounded
                    className="px-4"
                  >
                    <FileSpreadsheet />
                    <span>Spreadsheet</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    rounded
                    className="px-4"
                  >
                    <FileText />
                    <span>Import Document</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    rounded
                    className="px-4"
                  >
                    <ImageIcon />
                    <span>Import Image</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    rounded
                    className="px-4"
                  >
                    <VideoIcon />
                    <span>Youtube</span>
                  </Button>
                </div>
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
