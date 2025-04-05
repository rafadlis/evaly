"use client";

import CardQuestion from "@/components/shared/card/card-question";
import { Question } from "@evaly/backend/types/question";
import { motion } from "motion/react";
import React, { useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { env } from "@/lib/env";
import { useParams } from "next/navigation";

const Page = () => {
  const { templateId } = useParams();
  const { completion, complete } = useCompletion({
    body: {
      templateId,
    },
    api: env.NEXT_PUBLIC_API_URL + "/organization/question/llm/completition",
    credentials: "include",
  });

  useEffect(() => {
    complete("I want math");
  }, [complete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {completion}
      <div className="flex flex-col container max-w-4xl mt-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <React.Fragment key={index}>
            <CardQuestion
              key={index}
              className="p-0"
              data={
                {
                  id: String(index),
                  type: "text-field",
                  question: "What is the capital of France?",
                  order: index + 1,
                  // options: [{id: "1", text: "Paris", isCorrect: true}, {id: "2", text: "London", isCorrect: false}, {id: "3", text: "Berlin", isCorrect: false}, {id: "4", text: "Madrid", isCorrect: false}],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  deletedAt: null,
                } as Question
              }
            />
            {index !== 9 && (
              <div className="border-b border-border border-dashed w-full mb-6" />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default Page;
