import { useMemo } from "react";
import dayjs from "dayjs";
import { CheckCircle2, XCircle, HelpCircle, MailIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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

import { Submission } from "./types";
import { generateMockQuestions } from "./mock-data";

interface SubmissionDrawerProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubmissionDrawer = ({
  submission,
  open,
  onOpenChange,
}: SubmissionDrawerProps) => {
  // Generate questions outside of the return statement to avoid conditional hook call
  const questions = useMemo(
    () => (submission ? generateMockQuestions(submission) : []),
    [submission]
  );

  if (!submission) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => onOpenChange(false)}
          titleComponent={
            <DrawerHeader className="text-left py-0">
              <DrawerTitle className="">Submission Details</DrawerTitle>
              <DrawerDescription className="leading-1 text-muted-foreground">
                Viewing submission for {submission.name}
              </DrawerDescription>
            </DrawerHeader>
          }
        />
        <div className=" overflow-y-auto">
          <div className="container max-w-4xl py-10">
            {/* Participant Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Participant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{submission.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{submission.email}</div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Performance Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Performance Summary
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Score: {submission.score}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Submitted {dayjs(submission.submittedAt).fromNow()}
                  </span>
                </div>
                <Progress value={submission.score} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                    <div className="font-medium">
                      {submission.correct} of {submission.totalQuestions}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wrong</div>
                    <div className="font-medium">
                      {submission.wrong} of {submission.totalQuestions}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Unanswered
                    </div>
                    <div className="font-medium">
                      {submission.unanswered} of {submission.totalQuestions}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Questions and Answers */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Questions and Answers
              </h3>

              <div className="space-y-6">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="space-y-2 p-4 rounded-md border"
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{question.text}</div>
                      <Badge
                        variant={
                          question.isCorrect === true
                            ? "success"
                            : question.isCorrect === false
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {question.isCorrect === true
                          ? "Correct"
                          : question.isCorrect === false
                          ? "Wrong"
                          : "Unanswered"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Correct Answer
                        </div>
                        <div className="font-medium">
                          {question.correctAnswer}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Participant&apos;s Answer
                        </div>
                        <div
                          className={`font-medium ${
                            question.isCorrect === true
                              ? "text-green-600"
                              : question.isCorrect === false
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {question.participantAnswer || "Not answered"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
