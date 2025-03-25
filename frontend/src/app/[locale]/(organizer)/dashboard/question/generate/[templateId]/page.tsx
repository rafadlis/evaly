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
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [canvasMessageId] = useQueryState("canvasMessageId");
  const { templateId } = useParams();
  const { isPending, data } = useGetInitialMessages(templateId as string);
  const [chatPanelSize, setChatPanelSize] = useState<{
    min: number;
    max: number;
    default: number;
  }>({
    min: 20,
    max: 50,
    default: 100,
  });

  const getPanelSizePercentage = useCallback((targetWidth: number) => {
    if (typeof window === "undefined") return 0;
    return (targetWidth / window.innerWidth) * 100;
  }, []);

  useEffect(() => {
    const windowWidth = window.innerWidth;

    if (canvasMessageId) {
      setChatPanelSize({
        min: getPanelSizePercentage(300),
        max: getPanelSizePercentage(400),
        default: getPanelSizePercentage(400),
      });
    } else {
      setChatPanelSize({
        min: getPanelSizePercentage(windowWidth),
        max: getPanelSizePercentage(windowWidth),
        default: getPanelSizePercentage(windowWidth),
      });
    }
  }, [canvasMessageId, getPanelSizePercentage]);

  if (isPending) return <LoadingScreen />;
  if (!data) return notFound();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          minSize={chatPanelSize.min}
          defaultSize={chatPanelSize.default}
          maxSize={chatPanelSize.max}
        >
          <SectionChat initialMessages={data.messages ?? []} />
        </ResizablePanel>
        <ResizableHandle className="border-none" withHandle>
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
        </ResizableHandle>
        <ResizablePanel className="flex-1 bg-secondary/50 relative">
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:20px_20px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#262626_1px,transparent_1px)]"
            )}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-transparent"></div>
          <SectionCanvas />
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  );
};

export default Page;
