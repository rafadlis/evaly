"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, AlertCircle, User, Users, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { testTypeColor, testTypeFormatter } from "@/lib/test-type-formatter";
import { TestType } from "@evaly/backend/types/test";
import { cn } from "@/lib/utils";
    
// Mock data - would be fetched from API in real implementation
const testData = {
  title: "Frontend Development Assessment",
  type: "self-paced",
  duration: 60, // minutes
  totalSessions: 3,
  totalQuestions: 25,
  // This would be the rich text content from your editor
  description: `<p>This assessment evaluates your frontend development skills across HTML, CSS, JavaScript, and modern frameworks.</p><p>You'll work through multiple sections with increasing complexity to test your knowledge and problem-solving abilities.</p><ul><li>Complete all sections to finish the assessment</li><li>Answer questions carefully</li><li>Review your work before submitting</li></ul>`,
  sessions: [
    { title: "HTML & CSS Fundamentals", questionCount: 10, duration: 20 },
    { title: "JavaScript Core Concepts", questionCount: 8, duration: 20 },
    { title: "Frontend Frameworks", questionCount: 7, duration: 20 },
  ],
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTest = () => {
    setIsLoading(true);
    // In a real implementation, this would navigate to the first question
    setTimeout(() => {
      setIsLoading(false);
      // Navigation would happen here
    }, 1000);
  };

  return (
    <div className="py-10 xl:py-16 container">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Left column - Test info */}
        <div className="md:w-1/2">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="uppercase text-xs font-semibold tracking-wider"
            >
              Assessment
            </Badge>
            <Badge variant="secondary" className={cn("capitalize", testTypeColor(testData.type as TestType))}>
              {testTypeFormatter(testData.type as TestType)}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-4">
            {testData.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{testData.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{testData.totalQuestions} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>All participants</span>
            </div>
          </div>

          {/* Rich Text Description */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: testData.description }}
              />
            </CardContent>
          </Card>

          {/* Important notes */}
          <Card className="border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                    Important Notes
                  </h3>
                  <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
                    Once started, you&apos;ll have {testData.duration} minutes
                    to complete all sections. You can pause and resume, but the
                    timer will continue running.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Sections */}
        <div className="md:w-1/2">
          {/* Start Button */}
          <Button
            size="lg"
            onClick={handleStartTest}
            disabled={isLoading}
            className="w-full mb-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                Preparing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Assessment
              </span>
            )}
          </Button>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Test Sections</CardTitle>
              <CardDescription>
                Complete all {testData.totalSessions} sections to finish
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your progress</span>
                  <span className="font-medium">Not started</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {testData.sessions.map((session, index) => (
                  <div key={index} className="relative">
                    {index > 0 && (
                      <div className="absolute left-4 top-0 h-full w-px bg-muted -translate-y-full"></div>
                    )}
                    <div className="flex gap-4">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                            index === 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{session.title}</h3>
                          <Badge variant="outline" className="ml-2">
                            {session.duration} min
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            <span>{session.questionCount} questions</span>
                          </div>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {index === 0 &&
                            "Covers basic HTML structure, CSS styling, and responsive design principles."}
                          {index === 1 &&
                            "Tests your understanding of JavaScript fundamentals, DOM manipulation, and ES6+ features."}
                          {index === 2 &&
                            "Evaluates knowledge of modern frameworks like React, Vue, or Angular."}
                        </p>

                        {/* Topics covered */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {index === 0 && (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                HTML5
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                CSS3
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                Flexbox
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                Grid
                              </Badge>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                ES6+
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                DOM
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                Async
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                APIs
                              </Badge>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                React
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                Vue
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                State
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-background text-xs font-normal"
                              >
                                Hooks
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="border-t pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    Created by Frontend Team
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: June 15, 2023
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>1,234 completions</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By starting this test, you agree to our assessment terms and
                conditions
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
