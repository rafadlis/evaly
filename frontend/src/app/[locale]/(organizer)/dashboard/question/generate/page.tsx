"use client";
import { cn } from "@/lib/utils";
import GenerateQuestionInputPrompt from "@/components/shared/generate-question-input-prompt";

const Page = () => {


  return (
    <div className={cn("container flex-1 flex flex-col mt-[25vh]")}>
      {/* Prompt Section */}
      <GenerateQuestionInputPrompt />

      {/* Recent Section */}
      {/* <SectionRecent /> */}
    </div>
  );
};

export default Page;
