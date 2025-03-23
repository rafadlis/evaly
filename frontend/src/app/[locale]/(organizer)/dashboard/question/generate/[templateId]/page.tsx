"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { motion } from "motion/react";
import SectionCanvas from "./section-canvas";
import SectionChat from "./section-chat";

const Page = () => {
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel minSize={20} defaultSize={30} maxSize={50}>
          <SectionChat />
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
