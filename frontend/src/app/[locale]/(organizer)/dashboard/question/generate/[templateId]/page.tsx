"use client";

import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { parsePartialJson } from "@ai-sdk/ui-utils";

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) => {
  const { templateId } = useParams();
  const { message } = use(searchParams);
  const [messages, setMessages] = useState<
    {
      role: string;
      preMessage: string;
      questions: { question: string; answer: string; options: string[] }[];
      postMessage: string;
    }[]
  >([]);
  const { mutate: generateQuestions } = useMutation({
    mutationKey: ["generate-questions", templateId],
    mutationFn: async (message: string) => {
      const res = await $api.organization.question.llm.chat.post({
        message,
        id: templateId as string,
      });

      if (!res.data) return null;

      let result = "";
      for await (const chunk of res.data) {
        result += chunk;
        setMessages([parsePartialJson(result).value]);
      }

      return result;
    },
  });

  return (
    <>
      <Button onClick={() => generateQuestions(message)}>
        Generate Questions
      </Button>

      <div className="mt-4">
        {messages?.map((message, id) => (
          <div key={id} className="border">
            <p>{message.role}</p>
            <p className="font-bold">{message.preMessage}</p>
            <div className="mt-4 flex flex-col gap-4">
              {message.questions?.map((question, id) => (
                <div key={id} className="bg-secondary">
                  <p>{id + 1}. {question?.question}</p>
                  <p>jawaban: {question?.answer}</p>
                  <p>pilihan: {question?.options?.join(", ")}</p>
                </div>
              ))}
            </div>

            <p className="font-bold">{message.postMessage}</p>
          </div>
        ))}
      </div>
    </>
  );

  // return (
  //   <motion.div
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     exit={{ opacity: 0 }}
  //     transition={{ duration: 0.5 }}
  //   >
  //     <ResizablePanelGroup direction="horizontal" className="flex-1">
  //       <ResizablePanel minSize={20} defaultSize={30} maxSize={50}>
  //         <SectionChat />
  //       </ResizablePanel>
  //       <ResizableHandle className="border-dashed" />
  //       <ResizablePanel className="flex-1">
  //         <SectionCanvas />
  //       </ResizablePanel>
  //     </ResizablePanelGroup>
  //   </motion.div>
  // );
};

export default Page;
