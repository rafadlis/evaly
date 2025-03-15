import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  FileJson,
  Clock,
  Award,
  BarChart3,
  Calendar, Mail, Timer,
  AlertCircle
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  // Get status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-dvh bg-gradient-to-b from-background to-background/95">
        <DrawerNavbar
          onBack={() => onOpenChange(false)}
          titleComponent={
            <DrawerHeader className="text-left py-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(submission.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DrawerTitle className="text-lg font-semibold">
                    {submission.name}
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-muted-foreground leading-1 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {submission.email} 
                    {submission.submittedAt && (
                      <>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" /> {dayjs(submission.submittedAt).format('MMM D, YYYY')}
                      </>
                    )}
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>
          }
        />

        <div className="overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="container max-w-4xl py-6"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-full">
              <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="questions" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-8">
                {/* Status Card */}
                <Card className="border-none shadow-md overflow-hidden bg-white">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Test Performance
                    </CardTitle>
                    <CardDescription>
                      {submission.status === 'in-progress' 
                        ? (
                          <div className="flex items-center gap-1 text-amber-500">
                            <Timer className="h-4 w-4" />
                            <span>This test is still in progress</span>
                          </div>
                        ) 
                        : (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Completed on {submission.submittedAt 
                              ? dayjs(submission.submittedAt).format('MMMM D, YYYY [at] h:mm A')
                              : 'Unknown date'}</span>
                          </div>
                        )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-primary/5 to-primary/10 backdrop-blur-sm">
                        <div className={`text-3xl font-bold ${getScoreColor(submission.score)}`}>
                          {submission.score}%
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Score</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-amber-500/5 to-amber-500/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold flex items-center">
                          <Award className="h-6 w-6 text-amber-500 mr-1" />
                          {submission.rank || "-"}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Rank</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-green-500/5 to-green-500/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-green-600">
                          {submission.correct}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Correct</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-red-500/5 to-red-500/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold text-red-600">
                          {submission.wrong}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Wrong</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="font-medium">{submission.answered}/{submission.totalQuestions} questions</span>
                      </div>
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(submission.score)} transition-all duration-500 ease-in-out`} 
                          style={{ width: `${(submission.answered / submission.totalQuestions) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-2 w-2 text-green-600" />
                          </div>
                          <span>{submission.correct} correct</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-2 w-2 text-red-600" />
                          </div>
                          <span>{submission.wrong} wrong</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <HelpCircle className="h-2 w-2 text-muted-foreground" />
                          </div>
                          <span>{submission.unanswered} unanswered</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between text-sm p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Started: {submission.startedAt ? dayjs(submission.startedAt).format('h:mm A') : 'Unknown'}</span>
                      </div>
                      {submission.submittedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Submitted: {dayjs(submission.submittedAt).format('h:mm A')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Section Performance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2 px-1">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Section Performance
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {sections.map((section, index) => {
                      const performance = getSectionPerformance(section.id);
                      return (
                        <Card key={section.id} className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
                          <CardHeader className={`py-3 ${
                            performance.score >= 80 
                              ? 'bg-gradient-to-r from-green-500/20 to-green-500/5' 
                              : performance.score >= 60 
                              ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5' 
                              : 'bg-gradient-to-r from-red-500/20 to-red-500/5'
                          }`}>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base font-medium">
                                {section.name || `Section ${index + 1}`}
                              </CardTitle>
                              <Badge 
                                className={`${performance.score >= 80 ? 'bg-green-500' : 
                                  performance.score >= 60 ? 'bg-amber-500' : 'bg-red-500'} 
                                  text-white hover:opacity-90 shadow-sm`}
                              >
                                {performance.score}%
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-primary/5 to-primary/10">
                                <span className="text-lg font-semibold">
                                  {performance.answered}/{performance.total}
                                </span>
                                <span className="text-xs text-muted-foreground">Answered</span>
                              </div>
                              <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-green-500/5 to-green-500/10">
                                <span className="text-lg font-semibold text-green-600">
                                  {performance.correct}
                                </span>
                                <span className="text-xs text-muted-foreground">Correct</span>
                              </div>
                              <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-red-500/5 to-red-500/10">
                                <span className="text-lg font-semibold text-red-600">
                                  {performance.wrong}
                                </span>
                                <span className="text-xs text-muted-foreground">Wrong</span>
                              </div>
                              <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-primary/5 to-primary/10">
                                <span className="text-lg font-semibold">
                                  {performance.unanswered}
                                </span>
                                <span className="text-xs text-muted-foreground">Unanswered</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Progress
                                value={performance.score}
                                className={`h-2 ${getProgressColor(performance.score)}`}
                              />
                            </div>
                          </CardContent>
                        </Card>
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
                <Card className="border-none shadow-md overflow-hidden bg-white">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
                  <CardHeader className="pb-2 pt-6">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">Questions</CardTitle>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                          </div>
                          <span>Correct</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-2.5 w-2.5 text-red-600" />
                          </div>
                          <span>Wrong</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <HelpCircle className="h-2.5 w-2.5 text-muted-foreground" />
                          </div>
                          <span>Unanswered</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      Review all questions and answers for this submission
                    </CardDescription>
                  </CardHeader>
                </Card>

                {isLoading ? (
                  <div className="flex flex-col justify-center items-center py-20 gap-3">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      Loading questions...
                    </span>
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full min-h-dvh space-y-4">
                    {sections.map((section, i) => {
                      const sectionQuestions =
                        questionsBySection[section.id] || [];
                      const performance = getSectionPerformance(section.id);

                      return (
                        <Card key={section.id} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200">
                          <AccordionItem value={section.id} className="border-none">
                            <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-colors">
                              <div className="flex flex-1 justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {section.name || `Section ${i + 1}`}
                                  </span>
                                  <Badge 
                                    className={`ml-2 ${performance.score >= 80 ? 'bg-green-500' : 
                                      performance.score >= 60 ? 'bg-amber-500' : 'bg-red-500'} 
                                      text-white hover:opacity-90 shadow-sm`}
                                  >
                                    {performance.score}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm mr-4">
                                  <span className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                                      <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                                    </div>
                                    {performance.correct}
                                  </span>
                                  <span className="text-muted-foreground/50">
                                    /
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                                      <XCircle className="h-2.5 w-2.5 text-red-600" />
                                    </div>
                                    {performance.wrong}
                                  </span>
                                  <span className="text-muted-foreground/50">
                                    /
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                                      <HelpCircle className="h-2.5 w-2.5 text-muted-foreground" />
                                    </div>
                                    {performance.unanswered}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-0">
                              <div className="space-y-4 py-2">
                                {sectionQuestions.map((question, index) => (
                                  <div
                                    key={question.id}
                                    className="mx-6 mb-4 rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200"
                                  >
                                    <div className={`p-4 ${
                                      question.isCorrect === true
                                        ? "bg-gradient-to-r from-green-500/10 to-green-500/5"
                                        : question.isCorrect === false
                                        ? "bg-gradient-to-r from-red-500/10 to-red-500/5"
                                        : "bg-gradient-to-r from-primary/10 to-primary/5"
                                    }`}>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">
                                          {question.isCorrect === true ? (
                                            <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                                              <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                          ) : question.isCorrect === false ? (
                                            <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center shadow-sm">
                                              <XCircle className="h-4 w-4 text-red-600" />
                                            </div>
                                          ) : (
                                            <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-2 flex-1">
                                          <div className="flex justify-between">
                                            <h4 className="font-medium">
                                              Question {index + 1}
                                            </h4>
                                            <Badge variant="outline" className="capitalize shadow-sm">
                                              {question.type?.replace(/_/g, " ") ||
                                                "Unknown"}
                                            </Badge>
                                          </div>
                                          <div
                                            className="text-sm custom-prose"
                                            dangerouslySetInnerHTML={{
                                              __html: question.text || "",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-4 bg-white">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 p-3 rounded-lg bg-gradient-to-b from-primary/5 to-primary/10">
                                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3 text-green-600" />
                                            Correct Answer
                                          </p>
                                          <div
                                            className="text-sm font-medium custom-prose"
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                question.correctAnswer ||
                                                "Not available",
                                            }}
                                          />
                                        </div>
                                        <div className={`space-y-2 p-3 rounded-lg ${
                                          question.isCorrect === true
                                            ? "bg-gradient-to-b from-green-500/10 to-green-500/5"
                                            : question.isCorrect === false
                                            ? "bg-gradient-to-b from-red-500/10 to-red-500/5"
                                            : "bg-gradient-to-b from-gray-100 to-gray-50"
                                        }`}>
                                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            {question.isCorrect === true ? (
                                              <CheckCircle className="h-3 w-3 text-green-600" />
                                            ) : question.isCorrect === false ? (
                                              <XCircle className="h-3 w-3 text-red-600" />
                                            ) : (
                                              <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                            )}
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
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                question.participantAnswer ||
                                                "Not answered",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Card>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter className="border-t py-3">
          <div className="container max-w-4xl flex justify-between items-center gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-full">Close</Button>
            </DrawerClose>
            <Button variant="default" className="rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
              <FileJson className="mr-2 h-4 w-4" /> Export Details
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
