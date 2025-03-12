"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, AlertCircle, Play, Orbit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTestById } from "@/query/participants/test/use-test-by-id";
import { notFound, useParams } from "next/navigation";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { testTypeFormatter } from "@/lib/test-type-formatter";
import Navbar from "../../_components/navbar";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { toast } from "sonner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

const Page = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { testId } = useParams();
  const {
    data: testData,
    isPending: isPendingTestData,
    error,
  } = useTestById(testId as string);
  const [isRedirecting, startTransitionRedirect] = useTransition();

  const { mutate: mutateStartTest, isPending: isPendingStartTest } =
    useMutation({
      mutationKey: ["start-test"],
      mutationFn: async () => {
        const res = await $api.participant
          .test({ id: testId as string })
          .start.post();

        if (res.error?.value) {
          throw new Error(res.error.value);
        }

        const data = res.data;

        if (!data) {
          throw new Error("Something went wrong");
        }

        return data;
      },
      onSuccess: (data) => {
        let unFinishedSection;
        for (const section of data) {
          if (section.completedAt) {
            continue;
          }

          unFinishedSection = section;
          break;
        }

        if (!unFinishedSection?.id) {
          toast.error("You have completed all sections");
          return;
        }

        startTransitionRedirect(() => {
          router.push(`/s/${testId}/${unFinishedSection.id}`);
        });
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  if (isPendingTestData) {
    return (
      <div className="py-10 xl:py-16 container">
        <div className="flex flex-col md:flex-row gap-8 md:justify-between md:items-end mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
            </div>

            <Skeleton className="h-10 w-[300px] md:w-[400px] lg:w-[500px] mt-2 mb-4" />

            <div className="flex items-center gap-4 text-sm">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <Skeleton className="h-10 w-full md:w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-full max-w-[500px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-4 w-full max-w-[400px] mx-auto" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col gap-2 items-center justify-center text-2xl font-medium text-center">
        <h1>{error.message}</h1>
        {error.cause === 401 && (
          <Button onClick={() => router.push(`/login?callbackURL=${pathName}`)}>
            Login
          </Button>
        )}
        {error.cause === 403 && (
          <Button onClick={() => router.push(`/`)}>Go to Home</Button>
        )}
      </div>
    );
  }

  if (!testData) {
    return notFound();
  }

  return (
    <div>
      <Navbar />
      <div className="py-10 xl:py-16 container">
        <div className="flex flex-col md:flex-row gap-8 md:justify-between md:items-end mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-4">
              {testData.title}
            </h1>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Orbit className="h-4 w-4 text-muted-foreground" />
                {testTypeFormatter(testData?.type)}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {testData.totalDuration
                  ? `${testData.totalDuration} min`
                  : "No time limit"}
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{testData.totalQuestions} questions</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            {/* Start Button */}
            <Button
              size="lg"
              onClick={() => mutateStartTest()}
              disabled={isPendingStartTest || isRedirecting}
              className="w-full md:w-max"
            >
              {isPendingStartTest ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                  Preparing...
                </span>
              ) : isRedirecting ? (
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Redirecting to section...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Assessment
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left column - Test info */}
          <div className="md:w-1/2">
            {/* Rich Text Description */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="custom-prose md:prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: testData.description ?? "No description",
                  }}
                />
              </CardContent>
            </Card>

            {/* Important notes */}
            {testData.totalDuration && testData.totalDuration > 0 ? (
              <Card className="border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 mb-6">
                <CardContent className="pt-6">
                  <div className="flex gap-2.5">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                        Important Notes
                      </h3>
                      <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
                        Once started, you&apos;ll have {testData.totalDuration}{" "}
                        minutes to complete all sections. You can pause and
                        resume, but the timer will continue running.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Right column - Sections */}
          <div className="md:w-1/2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Test Sections</CardTitle>
                <CardDescription>
                  Complete all {testData.testSections?.length} sections to
                  finish
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
                  {testData.testSections?.map((section, index) => (
                    <div key={section.id} className="relative">
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
                            <h3 className="font-medium">{section.title}</h3>
                            <Badge variant="outline" className="ml-2">
                              {section.duration
                                ? `${section.duration} min`
                                : "No time limit"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-4 w-4" />
                              <span>{section.totalQuestions} questions</span>
                            </div>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
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
                    <AvatarFallback>
                      {testData.createdByOrganizer?.user.email
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Created by {testData.createdByOrganizer?.user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated:{" "}
                      {dayjs(
                        testData.createdByOrganizer?.user.updatedAt
                      ).format("DD MMM YYYY")}
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>1,234 completions</span>
                </div> */}
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
    </div>
  );
};

export default Page;
