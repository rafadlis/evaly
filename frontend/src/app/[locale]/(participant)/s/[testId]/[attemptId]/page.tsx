"use client";

import { useAttemptById } from "@/query/participants/attempt/use-attempt-by-id";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Navbar from "./_components/navbar";
import CardQuestion from "./_components/card-question";
import { useAttemptAnswerByAttemptId } from "@/query/participants/attempt/use-attempt-answer-by-attempt-id";

export const dynamic = "force-static";

const Page = () => {
  const { attemptId } = useParams();
  const { data: attempt, isPending: isPendingAttempt } = useAttemptById(
    attemptId as string
  );
  const { data: attemptAnswers, isPending: isPendingAttemptAnswers } =
    useAttemptAnswerByAttemptId(attemptId as string);

  if (isPendingAttempt || isPendingAttemptAnswers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="size-12 animate-spin" />
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
    <div>
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
    </div>
  );
};

export default Page;
