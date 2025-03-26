"use client";

import { motion } from "motion/react";
import SectionCanvas from "./section-canvas";
import SectionChat from "./section-chat";
import { useQueryState } from "nuqs";
import { useGetInitialMessages } from "@/query/organization/llm/get-initial-messages";
import { notFound, useParams } from "next/navigation";
import LoadingScreen from "@/components/shared/loading/loading-screen";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
// TODO: There is 3 states:
/* 
 Default:
  - If no canvasId: Sidebar is fullwidth, canvas is 0 width
  - If canvasId: Sidebar is 400px, canvas is full width
 Reactive:
  - If no canvasId: Sidebar is 400px, canvas is full width
  - If canvasId: Sidebar is 400px, canvas is full width
*/

const Page = () => {
  const [canvasMessageId] = useQueryState("canvasMessageId");
  const [openSidebar, setOpenSidebar] = useState(true);
  const [openCanvas, setOpenCanvas] = useState(
    canvasMessageId && canvasMessageId.length > 5
  );

  const { templateId } = useParams();
  const { isPending, data } = useGetInitialMessages(templateId as string);

  useEffect(() => {
    setOpenCanvas(canvasMessageId && canvasMessageId.length > 5);
  }, [canvasMessageId]);

  if (isPending) return <LoadingScreen />;
  if (!data) return notFound();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row"
    >
      <motion.div
        initial={{
          width: !openCanvas ? "100%" : openSidebar ? "400px" : "0px",
          opacity: openSidebar ? 1 : 0,
          zIndex: openSidebar ? 1 : -1,
        }}
        animate={{
          width: !openCanvas ? "100%" : openSidebar ? "400px" : "0px",
          opacity: openSidebar ? 1 : 0,
          zIndex: openSidebar ? 1 : -1,
        }}
        transition={{ duration: 0.15 }}
      >
        <SectionChat
          initialMessages={data.messages ?? []}
          className="min-w-[400px]"
        />
      </motion.div>
      <motion.button
        initial={{
          display: !openCanvas ? "none" : "block",
        }}
        animate={{
          display: !openCanvas ? "none" : "block",
        }}
        onClick={() => setOpenSidebar(!openSidebar)}
        type="button"
        className="h-[calc(100vh-56px)] w-4 bg-secondary/50 hover:bg-secondary cursor-pointer group"
      >
        <div className="w-1 h-10 bg-muted-foreground rounded-full ml-1.5 group-hover:bg-foreground transition-all duration-200" />
      </motion.button>
      <motion.div
        initial={{
          width: openCanvas ? "100%" : "0px",
          opacity: openCanvas ? 1 : 0,
          zIndex: openCanvas ? 1 : -1,
        }}
        animate={{
          width: openCanvas ? "100%" : "0px",
          opacity: openCanvas ? 1 : 0,
          zIndex: openCanvas ? 1 : -1,
        }}
        className="flex-1 relative bg-secondary/50"
      >
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#262626_1px,transparent_1px)]"
          )}
        />
        <SectionCanvas />
      </motion.div>
    </motion.div>
  );
};

export default Page;
