"use client";

import { useAttemptById } from "@/query/participants/attempt/use-attempt-by-id";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Navbar from "./_components/navbar";
import CardQuestion from "./_components/card-question";
import { useAttemptAnswerByAttemptId } from "@/query/participants/attempt/use-attempt-answer-by-attempt-id";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { attemptId, testId } = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const {
    data: attempt,
    isPending: isPendingAttempt,
    error: errorAttempt,
  } = useAttemptById(attemptId as string);
  const { data: attemptAnswers, isPending: isPendingAttemptAnswers } =
    useAttemptAnswerByAttemptId(attemptId as string);

  if (isPendingAttempt || isPendingAttemptAnswers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  if (errorAttempt) {
    return (
      <div className="flex-1 flex flex-col gap-2 items-center justify-center text-2xl font-medium text-center">
        <h1>{errorAttempt.message}</h1>
        {errorAttempt.cause === 401 && (
          <Button onClick={() => router.push(`/login?callbackURL=${pathName}`)}>
            Login
          </Button>
        )}
        {errorAttempt.cause === 403 && (
          <Button onClick={() => router.push(`/s/${testId}`)}>
            Go to Home
          </Button>
        )}
      </div>
    );
  }

  const listQuestions = attempt?.testSection?.question;

  if (!listQuestions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No questions found</p>
      </div>
    );
  }

  return (
    <>
      <Navbar attempt={attempt} />
      <div className="flex flex-col divide-y divide-dashed select-none container max-w-[900px]">
        {listQuestions.map((question, i) => (
          <CardQuestion
            key={question.id}
            question={question}
            i={i}
            attemptId={attemptId as string}
            defaultAnswer={attemptAnswers?.find(
              (answer) => answer.questionId === question.id
            )}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
