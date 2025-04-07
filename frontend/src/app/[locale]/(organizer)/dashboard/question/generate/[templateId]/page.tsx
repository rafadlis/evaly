"use client";

import CardQuestion from "@/components/shared/card/card-question";
import { Question } from "@evaly/backend/types/question";
import { QuestionGenerated } from "@evaly/backend/types/question.generated";
import { motion } from "motion/react";
import React, { useEffect, useTransition } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { env } from "@/lib/env";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/shared/loading/loading-screen";
import { useAllQuestionByReferenceIdQuery } from "@/query/organization/question/use-all-question-by-reference-id.query";
import { useQuestionTemplateById } from "@/query/organization/question/use-question-template-by-id";
import { cn } from "@/lib/utils";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { templateId } = useParams();
  const [isRedirecting, setIsRedirecting] = useTransition();
  const router = useRouter();
  const { data: dataTemplate, isPending: isPendingTemplate } =
    useQuestionTemplateById(templateId as string);
  const { data: dataQuestions, isPending: isPendingQuestions } =
    useAllQuestionByReferenceIdQuery({ referenceId: templateId as string });

  const { isLoading, object, submit } = useObject({
    api: env.NEXT_PUBLIC_API_URL + "/organization/question/llm/completition",
    credentials: "include",
    schema: QuestionGenerated,
    onFinish({}) {
      // refetchQuestions();
    },
  });

  const { mutateAsync: tranferQuestion, isPending: isPendingTransferQuestion } =
    useMutation({
      mutationKey: ["add-bulk-to-other-reference"],
      mutationFn: async (body: {
        order: number;
        fromReferenceId: string;
        toReferenceId: string;
      }) => {
        const res =
          await $api.organization.question["add-from-template"].post(body);

        if (res.error) {
          toast.error(res.error.value?.toString());
        }

        return res.data;
      },
    });

  async function onSave() {
    const { order, referenceid: toReferenceId, testid } = await searchParams;
    const fromReferenceId = dataTemplate?.id;
    console.log({
      order,
      testid,
      toReferenceId,
      fromReferenceId,
    });
    if (order !== undefined && testid && toReferenceId && fromReferenceId) {
      const transferredQuestion = await tranferQuestion({
        order: Number(order),
        toReferenceId: toReferenceId as string,
        fromReferenceId,
      });
      if (transferredQuestion && transferredQuestion.length > 0) {
        setIsRedirecting(() => {
          router.replace(
            `/dashboard/tests/${testid}/edit?selected-section=${toReferenceId}`
          );
          toast.success("Questions added successfully to your test!");
        });
      }
    } else {
      setIsRedirecting(() => {
        router.replace(`/dashboard/question/${templateId}`);
        toast.success("Questions saved successfully");
      });
    }

    // TODO add support for add question to another template
  }

  useEffect(() => {
    if (dataTemplate?.aiContents?.length === 1 && !isPendingTemplate) {
      submit({ prompt: dataTemplate?.aiContents?.at(0)?.prompt, templateId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTemplate, isPendingTemplate]);

  if (
    (isLoading && !object?.questions?.length) ||
    isPendingTemplate ||
    isPendingQuestions
  ) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20 relative"
    >
      <div
        onClick={() => {
          toast(
            "You need to save these questions first before you can edit them",
            {
              description: "Click the Save button below to continue.",
              descriptionClassName: "opacity-50 mt-2",
            }
          );
        }}
        className={cn(
          "flex flex-col container max-w-4xl my-10",
          isLoading ? "animate-pulse" : ""
        )}
      >
        {isLoading || !dataQuestions?.length
          ? object?.questions?.map((question, index) => (
              <React.Fragment key={index}>
                <CardQuestion
                  previewOnly
                  key={`qst-${index}`}
                  className="p-0"
                  data={question as Question}
                />
                {index !== 9 && (
                  <div className="border-b border-border border-dashed w-full my-6" />
                )}
              </React.Fragment>
            ))
          : dataQuestions?.map((question, index) => (
              <React.Fragment key={index}>
                <CardQuestion
                  previewOnly
                  key={question.id}
                  className="p-0"
                  data={question as Question}
                />
                {index !== 9 && (
                  <div className="border-b border-border border-dashed w-full my-6" />
                )}
              </React.Fragment>
            ))}
      </div>
      <div className="border-t fixed bottom-0 z-10 w-full bg-background ">
        <div className="flex flex-row justify-between h-14  items-center  container max-w-4xl ">
          <div>
            {isLoading ? (
              <TextShimmer>Generting your questions...</TextShimmer>
            ) : null}
          </div>
          <div>
            <Button
              disabled={isLoading || isRedirecting || isPendingTransferQuestion}
              onClick={() => {
                onSave();
              }}
            >
              {isPendingTransferQuestion || isRedirecting ? (
                <Loader2 className="animate-spin" />
              ) : null}
              {isRedirecting
                ? "Redirecting back..."
                : isPendingTransferQuestion
                  ? "Transferring your question!"
                  : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Page;
