"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Drawer, DrawerContent, DrawerNavbar } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { questionTypes } from "@/constants/question-type";
import { $api } from "@/lib/api";
import {
  InsertQuestion,
  Question,
  QuestionType,
} from "@evaly/backend/types/question";
import { useMutation } from "@tanstack/react-query";
import {
  BrainCircuit,
  ClipboardIcon,
  CloudUpload,
  FileSpreadsheetIcon,
  FileTextIcon,
  HelpCircle,
  Layers,
  Loader2,
  LockIcon,
  PenTool,
  Search,
  Sparkles,
  TableIcon,
  UploadIcon,
  Zap,
  ZapIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { getDefaultOptions } from "@/lib/get-default-options";

const DialogAddQuestion = ({
  referenceId,
  referenceType,
  onClose,
  order,
  onSuccessCreateQuestion,
}: {
  order?: number;
  referenceId?: string;
  referenceType?: Question["referenceType"];
  onClose?: () => void;
  onSuccessCreateQuestion?: (question: Question[]) => void;
}) => {
  const [selectedMethod, setSelectedMethod] = useState<
    "import" | "generate" | "create"
  >();

  const closeDialog = () => {
    onClose?.();
    setSelectedMethod(undefined);
  };

  const onBack = () => {
    if (selectedMethod === undefined) {
      closeDialog();
    } else {
      setSelectedMethod(undefined);
    }
  };

  if (!referenceId || !referenceType) return null;

  return (
    <Drawer open={order !== undefined} dismissible={false}>
      <DrawerContent className="h-dvh">
        {/* Header */}
        <DrawerNavbar onBack={onBack} title="Add new question" />

        <AnimatePresence mode="popLayout">
          {/* Step 1: Select method */}
          {selectedMethod === undefined ? (
            <motion.div
              key="select-method"
              initial={{
                opacity: 0,
                filter: "blur(5px)",
              }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.15 }}
              className="flex-1"
            >
              <SectionSelectMethod setSelectedMethod={setSelectedMethod} />
            </motion.div>
          ) : null}

          {/* Step 2 */}
          {/* Import Questions */}
          {selectedMethod === "import" ? (
            <motion.div
              key="import-questions"
              initial={{
                opacity: 0,
                filter: "blur(5px)",
                x: 100,
              }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(5px)", x: 100 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <SectionImportQuestions />
            </motion.div>
          ) : null}

          {/* Import with AI */}
          {selectedMethod === "generate" ? (
            <motion.div
              key="generate-questions"
              initial={{ opacity: 0, filter: "blur(5px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <SectionGenerateWithAI />
            </motion.div>
          ) : null}

          {/* Create from scratch */}
          {selectedMethod === "create" ? (
            <motion.div
              key="create-question"
              initial={{ opacity: 0, filter: "blur(5px)", x: 100 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(5px)", x: 100 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <SectionCreateQuestion
                referenceId={referenceId}
                referenceType={referenceType}
                order={order}
                onSuccessCreateQuestion={(questions) => {
                  onSuccessCreateQuestion?.(questions);
                  closeDialog();
                }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
};

const SectionCreateQuestion = ({
  referenceId,
  order,
  referenceType,
  onSuccessCreateQuestion,
}: {
  referenceId: string;
  referenceType: Question["referenceType"];
  order?: number;
  onSuccessCreateQuestion?: (question: Question[]) => void;
}) => {
  const [typeSelected, setTypeSelected] = useState<QuestionType>();

  const { mutate: mutateCreateQuestion, isPending: isPendingCreateQuestion } =
    useMutation({
      mutationKey: ["create-question"],
      mutationFn: async () => {
        if (!order || !typeSelected) return;

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
      },
    });

  const handleCreateQuestion = (type: QuestionType) => {
    if (!order) return;
    setTypeSelected(type);
    mutateCreateQuestion();
  };
  return (
    <div className="container max-w-4xl h-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold">Craft Your Custom Question</h2>
      <p className="text-muted-foreground mt-2">
        Select the type of question you want to create
      </p>
      <div className="flex flex-row flex-wrap gap-y-3 gap-x-2 mt-10">
        {Object.values(questionTypes).map((type) => (
          <Button
            key={type.value}
            size={"lg"}
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
    </div>
  );
};
const SectionImportQuestions = () => {
  return (
    <div className="h-full bg-background text-foreground flex flex-col overflow-y-auto">
      <main className="flex-1 flex justify-center w-full container max-w-6x">
        <Tabs className="mt-20 w-full" defaultValue="documents">
          <TabsList className="h-10 grid grid-cols-3">
            <TabsTrigger className="md:px-6 md:text-base" value="documents">
              <FileTextIcon className="mr-1" />
              Documents
            </TabsTrigger>
            <TabsTrigger className="md:px-6 md:text-base" value="paste">
              <ClipboardIcon className="mr-1" />
              Paste text
            </TabsTrigger>
            <TabsTrigger className="md:px-6 md:text-base" value="spreadsheet">
              <TableIcon className="mr-1" />
              Spreadsheet
            </TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="w-full">
            <Card className="flex flex-col items-center justify-center py-10">
              <CardHeader className="items-center">
                <CloudUpload className="text-muted-foreground" size={64} />
                <CardTitle className="text-2xl">
                  Import questions from existing documents
                </CardTitle>
                <CardDescription>
                  Upload files with questions from documents or spreadsheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary-outline"
                  className="w-full"
                  size={"lg"}
                >
                  <UploadIcon />
                  Upload file
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="paste" className="w-full">
            <Card className="flex flex-col items-center justify-center p-6">
              <div className="w-full min-h-[400px]">
                <Textarea
                  placeholder={`Paste your content here and we'll generate questions from it.

Example format (you can paste content in any form):

Question 1: What is the capital of France?
a) London
b) Berlin
c) Paris (Correct)
d) Madrid

Question 2: Which planet is closest to the sun?
a) Earth
b) Mercury (Correct)
c) Venus
d) Mars`}
                  className="w-full md:text-base resize-none h-full min-h-[300px] [&::placeholder]:whitespace-pre-wrap"
                  maxLength={10000}
                  style={{ minHeight: "400px", height: "400px" }}
                />
              </div>
              <Button className="w-max text-base h-11 self-end mt-4" size="lg">
                <ZapIcon /> Generate Questions
              </Button>
            </Card>
          </TabsContent>
          <TabsContent value="spreadsheet" className="w-full">
            <Card className="flex flex-col items-center justify-center py-10">
              <CardHeader className="items-center">
                <FileSpreadsheetIcon
                  className="text-muted-foreground"
                  size={64}
                />
                <CardTitle className="text-2xl">
                  Import questions from spreadsheets
                </CardTitle>
                <CardDescription>
                  Upload Excel or CSV files with questions in our template
                  format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary-outline"
                  className="w-full"
                  size={"lg"}
                >
                  <UploadIcon />
                  Upload spreadsheet
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4 border-dashed border-muted-foreground/30">
              <CardHeader>
                <CardTitle className="text-base">Template required</CardTitle>
                <CardDescription>
                  Please use our spreadsheet template to ensure your questions
                  are imported correctly. Our system needs specific columns to
                  process your questions properly.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" size="sm" className="mr-2">
                  <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                  Download template
                </Button>
                <DialogFormattingGuide />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const SectionGenerateWithAI = () => {
  const isIdle = true;

  if (isIdle) {
    return <div></div>;
  }
  return null;
};

const SectionSelectMethod = ({
  setSelectedMethod,
}: {
  setSelectedMethod: (method: "import" | "generate" | "create") => void;
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="h-full bg-background text-foreground flex flex-col overflow-y-auto">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full container max-w-6xl">
          <div className="text-center mb-10 relative">
            <h2 className="text-5xl font-bold text-foreground mb-2">
              Create your question
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose how you want to add a new question to your activity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create from scratch card */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent  transition-opacity duration-300 ${
                  hoveredCard === 2 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative z-10 border border-border  overflow-hidden h-full transition-all duration-300 hover:border-blue-500/50 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                      <PenTool className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Create manually
                    </h3>
                    <p className="text-muted-foreground">
                      Design your own questions from scratch
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center">
                    <div className="relative w-40 h-32">
                      <div className="absolute inset-0 bg-card rounded-lg border border-border overflow-hidden">
                        <div className="h-8 w-full bg-blue-500/10 flex items-center px-3">
                          <div className="text-xs font-bold text-blue-400">
                            Question Editor
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-3 p-2 bg-background rounded-md">
                            <Search className="text-blue-400" size={14} />
                            <div className="text-xs text-blue-400">
                              Browse question types...
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-blue-500/30"></div>
                              <div className="h-2 w-24 bg-muted rounded-sm"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-muted"></div>
                              <div className="h-2 w-20 bg-muted rounded-sm"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-muted"></div>
                              <div className="h-2 w-28 bg-muted rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedMethod("create")}
                      type="button"
                      className="w-full py-3 rounded-xl bg-card hover:bg-blue-500 border border-foreground/10 hover:border-blue-500/50 transition-all duration-200 text-muted-foreground hover:text-white font-medium cursor-pointer"
                    >
                      Create question
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Import worksheets/questions card */}
            <div
              className="relative opacity-70"
              // onMouseEnter={() => setHoveredCard(0)}
              // onMouseLeave={() => setHoveredCard(null)}
            >
              <Badge className="absolute top-4 right-4" variant={"outline"}>
                <LockIcon size={16} /> Coming soon
              </Badge>

              <div
                className={`absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent  transition-opacity duration-300 ${
                  hoveredCard === 0 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative z-10 border border-border  overflow-hidden h-full transition-all duration-300 hover:border-emerald-500/50 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Layers className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Import questions
                    </h3>
                    <p className="text-muted-foreground">
                      Upload files with questions from documents or spreadsheets
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -top-4 -left-4 w-20 h-28 bg-card rounded-lg border border-border transform rotate-[-12deg] transition-all duration-200 group-hover:rotate-[-8deg] group-hover:-translate-y-1">
                        <div className="h-3 w-12 bg-emerald-500/30 rounded-sm m-2 mb-4"></div>
                        <div className="h-2 w-14 bg-muted rounded-sm mx-2 mb-2"></div>
                        <div className="h-2 w-10 bg-muted rounded-sm mx-2 mb-2"></div>
                        <div className="h-2 w-12 bg-muted rounded-sm mx-2"></div>
                      </div>

                      <div className="absolute -top-2 left-2 w-20 h-28 bg-card rounded-lg border border-border transform rotate-[-4deg] transition-all duration-200 group-hover:rotate-[2deg] z-10">
                        <div className="grid grid-cols-4 gap-1 p-2">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="h-2 w-full bg-emerald-500/20 rounded-sm"
                            ></div>
                          ))}
                        </div>
                      </div>

                      <div className="relative w-20 h-28 bg-card rounded-lg border border-border transform rotate-[6deg] transition-all duration-200 group-hover:rotate-[10deg] group-hover:translate-y-1 left-8">
                        <div className="h-3 w-12 bg-emerald-500/30 rounded-sm m-2 mb-3"></div>
                        <div className="h-10 w-14 bg-muted/50 rounded-sm mx-2 mb-2"></div>
                        <div className="h-2 w-10 bg-muted rounded-sm mx-2 mb-2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedMethod("import")}
                      type="button"
                      disabled={true}
                      className="w-full flex flex-row items-center justify-center gap-2 disabled:cursor-not-allowed py-3 rounded-xl bg-card hover:bg-emerald-500/20 border border-foreground/10 hover:border-emerald-500/50 transition-all duration-200 text-muted-foreground hover:text-emerald-400 font-medium cursor-pointer"
                    >
                      <LockIcon size={16} /> Import questions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate with AI card */}
            <div
              className="relative opacity-70"
              // onMouseEnter={() => setHoveredCard(1)}
              // onMouseLeave={() => setHoveredCard(null)}
            >
              <Badge className="absolute top-4 right-4" variant={"outline"}>
                <LockIcon size={16} /> Coming soon
              </Badge>

              <div
                className={`absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent  transition-opacity duration-300 ${
                  hoveredCard === 1 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative z-10 border border-border  overflow-hidden h-full transition-all duration-300 hover:border-purple-500/50 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <BrainCircuit className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Generate with AI
                    </h3>
                    <p className="text-muted-foreground">
                      Create questions automatically from your content or topics
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center">
                    <div className="relative w-40 h-32">
                      <div className="absolute inset-0 bg-card rounded-lg border border-border overflow-hidden">
                        <div className="h-1 w-full bg-purple-500/30"></div>
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Zap className="text-purple-400" size={14} />
                            </div>
                            <div className="h-2 w-20 bg-muted rounded-sm"></div>
                          </div>

                          <div className="space-y-2">
                            <div className="h-2 w-full bg-muted rounded-sm"></div>
                            <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                            <div className="h-2 w-5/6 bg-muted rounded-sm"></div>
                            <div className="h-2 w-2/3 bg-muted rounded-sm"></div>
                          </div>

                          <div className="mt-4 flex space-x-2">
                            <div className="h-6 w-6 rounded-md bg-purple-500/20 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            </div>
                            <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                            </div>
                            <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Sparkles className="text-purple-400" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedMethod("generate")}
                      type="button"
                      disabled
                      className="w-full disabled:cursor-not-allowed flex flex-row items-center justify-center gap-2 py-3 rounded-xl bg-card hover:bg-purple-500/20 border border-foreground/10 hover:border-purple-500/50 transition-all duration-200 text-muted-foreground hover:text-purple-400 font-medium cursor-pointer"
                    >
                      <LockIcon size={16} /> Generate questions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DialogFormattingGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-muted-foreground">
          <HelpCircle className="mr-1 h-4 w-4" />
          View formatting guide
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-5xl max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FileSpreadsheetIcon className="mr-2" />
            Spreadsheet Formatting Guide
          </DialogTitle>
          <DialogDescription>
            Follow these guidelines to ensure your spreadsheet imports correctly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Spreadsheet Columns</h3>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Column Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Example</th>
                    <th className="px-4 py-2 text-center">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3 font-medium">Question</td>
                    <td className="px-4 py-3">The text of your question</td>
                    <td className="px-4 py-3">
                      What is the capital of France?
                    </td>
                    <td className="px-4 py-3 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Option A</td>
                    <td className="px-4 py-3">First answer choice</td>
                    <td className="px-4 py-3">London</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Option B</td>
                    <td className="px-4 py-3">Second answer choice</td>
                    <td className="px-4 py-3">Berlin</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Option C</td>
                    <td className="px-4 py-3">Third answer choice</td>
                    <td className="px-4 py-3">Paris</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Option D</td>
                    <td className="px-4 py-3">Fourth answer choice</td>
                    <td className="px-4 py-3">Madrid</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Correct Answer</td>
                    <td className="px-4 py-3">
                      Letter of correct option (A, B, C, or D)
                    </td>
                    <td className="px-4 py-3">C</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Explanation</td>
                    <td className="px-4 py-3">
                      Explanation for the correct answer
                    </td>
                    <td className="px-4 py-3">
                      Paris is the capital city of France.
                    </td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Difficulty</td>
                    <td className="px-4 py-3">
                      Question difficulty (Easy, Medium, Hard)
                    </td>
                    <td className="px-4 py-3">Easy</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Category</td>
                    <td className="px-4 py-3">Subject category</td>
                    <td className="px-4 py-3">Geography</td>
                    <td className="px-4 py-3 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-md bg-muted p-4">
            <h3 className="text-lg font-medium mb-2">Tips for Success</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Make sure your spreadsheet has a header row with the exact
                column names listed above
              </li>
              <li>Each row should contain one complete question</li>
              <li>
                For the &quot;Correct Answer&quot; column, only use A, B, C, or
                D (not the full text of the answer)
              </li>
              <li>
                You can include up to 500 questions in a single spreadsheet
              </li>
              <li>Save your file as .xlsx or .csv format</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex justify-between sticky -bottom-8 bg-background w-full py-6 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close guide</Button>
          </DialogClose>
          <Button>
            <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
            Download template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddQuestion;
