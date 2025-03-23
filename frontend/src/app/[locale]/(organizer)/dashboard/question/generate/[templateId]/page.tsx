"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { motion } from "motion/react";
import SectionCanvas from "./section-canvas";
import SectionChat from "./section-chat";
import { useQueryState } from "nuqs";
import { useGetInitialMessages } from "@/query/organization/llm/get-initial-messages";
import { notFound, useParams } from "next/navigation";
import LoadingScreen from "@/components/shared/loading/loading-screen";

const Page = () => {
  const [canvasMessageId] = useQueryState("canvasMessageId");
  const { templateId } = useParams();
  const { isPending, data } = useGetInitialMessages(templateId as string);

  if (isPending) return <LoadingScreen />

  if (!data) return notFound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          minSize={20}
          defaultSize={canvasMessageId ? 30 : 100}
          maxSize={canvasMessageId ? 50 : 100}
        >
          <SectionChat initialMessages={data.messages ?? []} />
        </ResizablePanel>
        <ResizableHandle className="border-dashed" />
        <ResizablePanel className="flex-1">
          <SectionCanvas />
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
};

export default Page;
