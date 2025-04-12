"use client";

import {
  ArrowRight,
  CheckCircleIcon,
  CheckIcon,
  Clock,
  FileText,
  Play,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTestById } from "@/query/participants/test/use-test-by-id";
import { notFound, useParams } from "next/navigation";
import dayjs from "dayjs";
import { testTypeFormatter } from "@/lib/test-type-formatter";
import Navbar from "../../_components/navbar";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useMemo, useTransition } from "react";
import LoadingScreen from "@/components/shared/loading/loading-screen";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttemptStartMutation } from "@/query/participants/attempt/use-attempt-start.mutation";
import { TestSection } from "@evaly/backend/types/test";
import { Link } from "@/components/shared/progress-bar";

const Page = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { testId } = useParams();
  const {
    data: testData,
    isPending: isPendingTestData,
    error,
  } = useTestById(testId as string);

  const completedAttempts =
    testData?.attempt.filter((attempt) => attempt.completedAt).length || 0;
  const totalAttempts = testData?.attempt.length || 0;
  const totalSections = testData?.testSections?.length || 0;
  const isCompleted = completedAttempts === totalSections;

  // const attemptProgress =
  //   testData?.attempt && testData?.testSections?.length
  //     ? (completedAttempts / totalAttempts) * 100
  //     : 0;

  const currentSection = useMemo(() => {
    if (!testData?.testSections?.length) return undefined;

    // Find the first section that doesn't have a completed attempt
    const nextIncompleteSection = testData.testSections.find((section) => {
      const sectionAttempt = testData.attempt.find(
        (attempt) => attempt.testSectionId === section.id
      );
      return !sectionAttempt?.completedAt;
    });

    return nextIncompleteSection || undefined;
  }, [testData?.testSections, testData?.attempt]);

  if (isPendingTestData) {
    return <LoadingScreen />;
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
      {/* {JSON.stringify(testData.organization)} */}
      {testData ? <title>{`${testData.title}`}</title> : null}
      <Navbar />

      <div className="pb-20 mt-[5vh] md:mt-[10vh] lg:mt-[12vh] container max-w-2xl">
        {/* Completed Attempts */}
        {isCompleted && (
          <span className="text-sm mb-2 flex flex-row items-center gap-2 text-success-foreground font-medium">
            <CheckIcon className="size-4" />
            You have completed all sections.
          </span>
        )}

        <h1 className="text-2xl md:text-3xl font-medium mb-4">
          {testData.title}
        </h1>

        {/* Quick Info */}
        <div className="flex flex-row flex-wrap">
          <div className="flex items-center gap-3 text-sm">
            {testData.finishedAt ? (
              <Badge>
                <CheckCircleIcon />
                Test Finished
              </Badge>
            ) : null}
            <Badge variant={"secondary"}>
              {testTypeFormatter(testData?.type)}
            </Badge>
            {testData.totalDuration ? (
              <Badge variant={"secondary"}>
                <Clock className="h-4 w-4 text-muted-foreground" />
                {testData.totalDuration} min
              </Badge>
            ) : null}
            <Badge variant={"secondary"}>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{testData.totalQuestions} questions</span>
            </Badge>
          </div>
        </div>

        {/* Start / Continue Button */}
        <StartContinueButton
          testId={testId as string}
          currentSection={currentSection}
          completedAttempts={completedAttempts}
          totalAttempts={totalAttempts}
          totalSections={totalSections}
        />

        {/* Always show Result component when test is finished */}
        {(isCompleted || testData.finishedAt) ? <Result testId={testId as string} /> : null}

        <SectionList
          testId={testId as string}
          currentSection={currentSection}
          totalAttempts={totalAttempts}
        />

        <ParticipantList testId={testId as string} />
        <Description description={testData.description} />

        <CreatedByOrganizer testId={testId as string} />
      </div>
    </div>
  );
};

const StartContinueButton = ({
  testId,
  currentSection,
  completedAttempts,
  totalAttempts,
  totalSections,
}: {
  testId: string;
  currentSection?: TestSection;
  completedAttempts: number;
  totalAttempts: number;
  totalSections: number;
}) => {
  const router = useRouter();
  const [isRedirecting, startTransitionRedirect] = useTransition();
  const { data: testData } = useTestById(testId);

  const { mutate: mutateStartTest, isPending: isPendingStartTest } =
    useAttemptStartMutation((data) => {
      startTransitionRedirect(() => {
        router.push(`/s/${testId}/${data.id}`);
      });
    });

  // Don't show button if all sections are completed or test is finished
  if (completedAttempts === totalSections || testData?.finishedAt) return null;
  
  return (
    <Button
      onClick={() =>
        currentSection &&
        mutateStartTest({
          testId: testId as string,
          testSectionId: currentSection.id,
        })
      }
      disabled={
        isPendingStartTest ||
        isRedirecting ||
        !!testData?.finishedAt ||
        (totalAttempts === completedAttempts &&
          totalSections === completedAttempts)
      }
      className="w-full md:w-max mt-6"
      variant={
        totalAttempts === completedAttempts &&
        totalSections === completedAttempts
          ? "secondary"
          : totalAttempts > 0
            ? "secondary"
            : "default"
      }
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
      ) : totalAttempts > 0 ? (
        <span className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Continue Assessment
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Start Assessment
        </span>
      )}
    </Button>
  );
};

const SectionList = ({
  testId,
  currentSection,
  totalAttempts,
}: {
  testId: string;
  currentSection?: TestSection;
  totalAttempts: number;
}) => {
  const [isRedirecting, startTransitionRedirect] = useTransition();
  const { data: testData } = useTestById(testId);
  const router = useRouter();

  const { mutate: mutateStartTest, isPending: isPendingStartTest } =
    useAttemptStartMutation((data) => {
      startTransitionRedirect(() => {
        router.push(`/s/${testId}/${data.id}`);
      });
    });

  const attempt = testData?.attempt;

  const getAttemptBySectionId = (sectionId: string) => {
    return attempt?.find((attempt) => attempt.testSectionId === sectionId);
  };

  if (!testData) {
    return null;
  }

  return (
    <>
      <h1 className="font-medium mt-10">Sections</h1>
      <div className="space-y-2 mt-3">
        {testData.testSections?.map((section) => {
          const attempt = getAttemptBySectionId(section.id);
          return (
            <Card
              key={section.id}
              className="p-3 border-dashed hover:border-foreground hover:border-solid flex flex-row items-center"
            >
              <div className="flex flex-col flex-1">
                <h1 className="font-medium text-sm">
                  {section.order}. {section.title || `Section ${section.order}`}
                </h1>
                <span className="text-[13px] mt-1 text-muted-foreground">
                  {section.totalQuestions} Questions
                </span>
              </div>
              <div>
                {attempt?.completedAt ? (
                  <Badge variant="success">
                    <CheckIcon /> Completed
                  </Badge>
                ) : testData.finishedAt ? (
                  <Badge variant="outline">
                    Test Ended
                  </Badge>
                ) : (
                  <Button
                    onClick={() => {
                      mutateStartTest({
                        testId: testId as string,
                        testSectionId: section.id,
                      });
                    }}
                    size={"xs"}
                    disabled={isPendingStartTest || isRedirecting || !!testData.finishedAt}
                    variant={"outline"}
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
                    ) : currentSection?.id === section.id &&
                      totalAttempts > 0 ? (
                      <>
                        Continue <ArrowRight className="size-3" />
                      </>
                    ) : (
                      <>
                        Start <ArrowRight className="size-3" />
                      </>
                    )}
                  </Button>
                )}
              </div>
              {/* {section.description && (
            <p className="text-xs text-muted-foreground mt-2">
              {section.description}
            </p>
          )} */}
            </Card>
          );
        })}
      </div>
    </>
  );
};

const ParticipantList = ({ testId }: { testId: string }) => {
  const { data: testData } = useTestById(testId);
  if (!testData) {
    return null;
  }

  if (testData.access !== "invite-only" || !testData.invitations?.length) {
    return null;
  }

  return (
    <>
      <h1 className="font-medium mt-10">Participants</h1>
      <div className="flex flex-row flex-wrap gap-2 mt-3">
        {testData.invitations?.map((invitation) => {
          return (
            <Badge
              variant="secondary"
              key={invitation.id}
              className="text-sm px-3 py-1"
            >
              {invitation.email}
            </Badge>
          );
        })}
      </div>
    </>
  );
};

const Description = ({ description }: { description?: string | null }) => {
  return (
    <>
      <h1 className="font-medium mt-10">Description</h1>
      <div
        className="custom-prose max-w-none mt-3 whitespace-pre-line text-foreground"
        dangerouslySetInnerHTML={{
          __html: description ?? "No description",
        }}
      />
    </>
  );
};

const CreatedByOrganizer = ({ testId }: { testId: string }) => {
  const { data: testData } = useTestById(testId);

  if (!testData) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-3 w-full bg-background mt-10 border-t border-dashed pt-5">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
          <AvatarFallback>
            {testData.createdByOrganizer?.user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="text-sm font-medium">
            Created by {testData.createdByOrganizer?.user.name}
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated:{" "}
            {dayjs(testData.createdByOrganizer?.user.updatedAt).format(
              "DD MMM YYYY"
            )}
          </div>
        </div>
        {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>1,234 completions</span>
                </div> */}
      </div>
    </>
  );
};

const Result = ({ testId }: { testId: string }) => {
  const { data: testData } = useTestById(testId);

  if (!testData) {
    return null;
  }

  // Never show results if visibility is set to "never"
  if (testData.resultVisibility === "never") return null;

  // Handle "after_test_end" visibility setting
  if (testData.resultVisibility === "after_test_end") {
    if (!testData.finishedAt) {
      return (
        <Button variant="outline" disabled className="mt-4 w-full">
          You can view your result after the test ends
        </Button>
      );
    }
  }

  // Show result button if either:
  // 1. resultVisibility is "always" 
  // 2. resultVisibility is "after_test_end" AND test has finished
  return (
    <Link href={`/s/${testId}/result`}>
      <Button variant="default" className="mt-6 w-max">
        Track your result <ArrowRight className="size-4" />
      </Button>
    </Link>
  );
};

export default Page;
