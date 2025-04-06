"use client";

import CardQuestion from "@/components/shared/card/card-question";
import { Question } from "@evaly/backend/types/question";
import { QuestionGenerated } from "@evaly/backend/types/question.generated";
import { motion } from "motion/react";
import React from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { env } from "@/lib/env";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/shared/loading/loading-screen";

const Page = () => {
  const { templateId } = useParams();
  const { isLoading, object, stop, submit } = useObject({
    api: env.NEXT_PUBLIC_API_URL + "/organization/question/llm/completition",
    credentials: "include",
    schema: QuestionGenerated,
  });

  if (isLoading && !object?.questions?.length){
    return <LoadingScreen />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => submit({ templateId })}>Hi</button>
      <div className="flex flex-col container max-w-4xl my-10">
        {object?.questions?.map((question, index) => (
          <React.Fragment key={index}>
            <CardQuestion
              key={`qst-${index}`}
              className="p-0"
              data={question as Question}
            />
            {index !== 9 && (
              <div className="border-b border-border border-dashed w-full my-6" />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default Page;
