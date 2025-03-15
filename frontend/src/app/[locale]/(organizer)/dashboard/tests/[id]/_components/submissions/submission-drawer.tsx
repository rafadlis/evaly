import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCircle, XCircle, HelpCircle, MailIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerNavbar,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Submission, Section } from "./types";
import { useSubmissionDetails } from "@/query/organization/test/use-submission-details";

dayjs.extend(relativeTime);

interface SubmissionDrawerProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: Section[];
  testId: string;
}

export const SubmissionDrawer = ({
  submission,
  open,
  onOpenChange,
  sections,
  testId,
}: SubmissionDrawerProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Fetch detailed submission data when drawer is open
  const { data: submissionDetails, isLoading } = useSubmissionDetails(
    open ? testId : "", // Only fetch when drawer is open
    open && submission ? submission.email : ""
  );

  // Use the detailed questions from the API response
  const questions = useMemo(() => {
    if (!submissionDetails) return [];
    return submissionDetails.questions || [];
  }, [submissionDetails]);

  // Group questions by section
  const questionsBySection = useMemo(() => {
    if (!questions.length) return {};

    return questions.reduce((acc, question) => {
      const sectionId = question.sectionId;
      if (!acc[sectionId]) {
        acc[sectionId] = [];
      }
      acc[sectionId].push(question);
      return acc;
    }, {} as Record<string, typeof questions>);
  }, [questions]);

  if (!submission) return null;

  // Calculate section performance
  const getSectionPerformance = (sectionId: string) => {
    const answered = submission.sectionAnswers?.[sectionId] || 0;
    const correct = submission.sectionCorrect?.[sectionId] || 0;
    const wrong = submission.sectionWrong?.[sectionId] || 0;
    const section = sections.find((s) => s.id === sectionId);
    const total = section?.questionsCount || 0;
    const unanswered = total - answered;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { answered, correct, wrong, unanswered, total, score };
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => onOpenChange(false)}
          titleComponent={
            <DrawerHeader className="text-left py-0">
              <DrawerTitle className="text-lg">{submission.name}</DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground leading-1">
                {submission.email} • Submitted{" "}
                {dayjs(submission.submittedAt).fromNow()}
              </DrawerDescription>
            </DrawerHeader>
          }
        />

        <div className="overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="container max-w-4xl py-10"
          >
            <TabsList className="justify-start mb-6">
              <TabsTrigger value="overview" className="flex-1 sm:flex-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex-1 sm:flex-none">
                Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Overall Performance</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold">{submission.score}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Rank</p>
                      <p className="text-2xl font-bold">
                        #{submission.rank || "-"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Correct</p>
                      <p className="text-2xl font-bold text-green-600">
                        {submission.correct}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Wrong</p>
                      <p className="text-2xl font-bold text-red-600">
                        {submission.wrong}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Progress value={submission.score} className="h-2" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Section Performance</h3>
                  <div className="space-y-4">
                    {sections.map((section) => {
                      const performance = getSectionPerformance(section.id);
                      return (
                        <div key={section.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{section.name}</h4>
                            <Badge variant="outline">
                              {performance.score}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Answered</p>
                              <p>
                                {performance.answered}/{performance.total}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Correct</p>
                              <p className="text-green-600">
                                {performance.correct}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Wrong</p>
                              <p className="text-red-600">
                                {performance.wrong}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Unanswered
                              </p>
                              <p>{performance.unanswered}</p>
                            </div>
                          </div>
                          <Progress
                            value={performance.score}
                            className="h-1.5"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="questions"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Wrong</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Unanswered</span>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading questions...</span>
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full min-h-dvh">
                    {sections.map((section) => {
                      const sectionQuestions =
                        questionsBySection[section.id] || [];
                      const performance = getSectionPerformance(section.id);

                      return (
                        <AccordionItem
                          key={section.id}
                          value={section.id}
                        >
                          <AccordionTrigger className="hover:bg-secondary rounded-md px-2">
                            <div className="flex flex-1 justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span>{section.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {performance.score}%
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm mr-4">
                                <span className="text-green-600">
                                  {performance.correct}
                                </span>
                                <span className="text-muted-foreground/50">/</span>
                                <span className="text-red-600">
                                  {performance.wrong}
                                </span>
                                <span className="text-muted-foreground/50">/</span>
                                <span className="text-muted-foreground">
                                  {performance.unanswered}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 py-2">
                              {sectionQuestions.map((question, index) => (
                                <div
                                  key={question.id}
                                  className={`p-4 rounded-md border ${
                                    question.isCorrect === true
                                      ? "bg-emerald-500/10 border-emerald-500/20"
                                      : question.isCorrect === false
                                      ? "bg-red-500/10 border-red-500/20"
                                      : "bg-foreground/5 border-foreground/10"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                      {question.isCorrect === true ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                      ) : question.isCorrect === false ? (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                      ) : (
                                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="space-y-2 flex-1">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium">
                                          Question {index + 1}
                                        </h4>
                                        <Badge variant="outline">
                                          {question.type?.replace("_", " ") || "Unknown"}
                                        </Badge>
                                      </div>
                                      <div 
                                        className="text-sm custom-prose"
                                        dangerouslySetInnerHTML={{ __html: question.text || '' }}
                                      />

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                          <p className="text-xs text-muted-foreground">
                                            Correct Answer
                                          </p>
                                          <div 
                                            className="text-sm font-medium custom-prose"
                                            dangerouslySetInnerHTML={{ __html: question.correctAnswer || 'Not available' }}
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs text-muted-foreground">
                                            Participant&apos;s Answer
                                          </p>
                                          <div
                                            className={`text-sm font-medium custom-prose ${
                                              question.isCorrect === true
                                                ? "text-green-600"
                                                : question.isCorrect === false
                                                ? "text-red-600"
                                                : "text-muted-foreground italic"
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: question.participantAnswer || 'Not answered' }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter className="border-t border-dashed py-3">
          <div className="container max-w-4xl flex justify-between items-center gap-2">
            <Button variant="success">
              Finished {dayjs(submission.submittedAt).fromNow()}
            </Button>
            <div className="flex gap-2 justify-end">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
              <Button variant="default">
                <MailIcon /> Send Email
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
