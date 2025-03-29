"use client";
import LoadingScreen from "@/components/shared/loading/loading-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextLoop } from "@/components/ui/text-loop";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/navigation";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  ClockIcon,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Lightbulb,
  Loader2,
  Paperclip,
  RefreshCw,
  Rocket,
  Search,
  SearchIcon,
  VideoIcon,
  Wand2Icon,
  WandSparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTransition } from "react";
import { useState, KeyboardEvent } from "react";
import { toast } from "sonner";

const Page = () => {
  const autoComplete: string[] = [];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  // const searchParams = useSearchParams()

  // const referenceId = searchParams.get("templateId");
  // const showImportSection = searchParams.get("showImportSection");

  const { mutate: startGeneration, isPending: isGenerating } = useMutation({
    mutationKey: ["start-question-generation"],
    mutationFn: async (message: string, files?: File[]) => {
      if (message.length <= 0) {
        toast.error("Message is required");
        return;
      }

      const res = await $api.organization.question.llm.create.post({
        files,
      });

      const data = res.data;

      if (!data) {
        toast.error("Failed to generate questions, please try again.");
        return;
      }
      startTransition(() => {
        router.push(
          `/dashboard/question/generate/${data.id}?initialMessage=${message}&canvasMessageId=`,
          { scroll: true }
        );
      });

      return res.data;
    },
  });

  const { data: messages, isPending: isLoadingMessages } = useQuery({
    queryKey: ["llm-messages"],
    queryFn: async () => {
      const res = await $api.organization.question.llm.chat.get();
      return res.data;
    },
  });

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    startGeneration(inputValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      handleSubmit();
    }
  };

  if (isLoadingMessages) return <LoadingScreen />;

  return (
    <div
      className={cn(
        "container flex-1 flex flex-col",
        messages && messages.length > 0 ? "mt-28" : "-mt-14 justify-center "
      )}
    >
      {/* Prompt Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-col flex items-center"
      >
        <TextLoop
          interval={3}
          transition={{
            type: "spring",
            stiffness: 900,
            damping: 80,
            mass: 10,
          }}
          variants={{
            initial: {
              y: 20,
              rotateX: 90,
              opacity: 0,
              filter: "blur(4px)",
            },
            animate: {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
            },
            exit: {
              y: -20,
              rotateX: -90,
              opacity: 0,
              filter: "blur(4px)",
            },
          }}
          className="relative text-primary font-mono mb-4 w-full max-w-2xl text-sm"
        >
          <span>
            <WandSparkles className="size-3 inline" /> Let&apos;s Craft Your
            Question
          </span>
          <span>
            <Lightbulb className="size-3 inline" /> Turn Ideas into Inquiries
          </span>
          <span>
            <Brain className="size-3 inline" /> Design Thought-Provoking
            Questions
          </span>
          <span>
            <Rocket className="size-3 inline" /> Create Engaging Challenges
          </span>
          <span>
            <Search className="size-3 inline" /> Spark Curiosity with Questions
          </span>
          <span>
            <RefreshCw className="size-3 inline" /> Transform Concepts into
            Queries
          </span>
        </TextLoop>
        <div className="max-w-2xl w-full">
          <div className="relative">
            <Textarea
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter prompt or paste content to generate questions..."
              className={cn(
                "w-full h-[120px] overflow-clip text-sm md:text-base p-4 [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:border-foreground/20 shadow-none transition-all duration-200",
                autoComplete.length > 0
                  ? "focus-visible:border-b-transparent rounded-b-none"
                  : ""
              )}
            />
            <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-between w-full">
              <div className="flex flex-row gap-2 items-center justify-center"></div>
              <div className="flex flex-row items-center justify-center gap-1">
                <Button size={"icon-sm"} variant={"ghost"} disabled>
                  <Wand2Icon />
                </Button>
                <Button size={"icon-sm"} variant={"ghost"}>
                  <Paperclip />
                </Button>
                <Button
                  size={"icon-sm"}
                  variant={inputValue.trim() ? "default" : "secondary-outline"}
                  onClick={handleSubmit}
                  disabled={isPending || !inputValue.trim() || isGenerating}
                >
                  {isPending || isGenerating ? (
                    <Loader2 className="size-4 stroke-3 text-muted-foreground animate-spin" />
                  ) : (
                    <ArrowRight className="size-4 stroke-3" />
                  )}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {autoComplete.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="z-10 absolute top-[120px] bg-background w-full border border-foreground/20 border-t-border rounded-b-2xl p-2"
                >
                  <ScrollArea className="h-[200px] flex flex-col gap-2">
                    {autoComplete.map((item, index) => (
                      <Button
                        key={index}
                        variant={"ghost"}
                        className="w-full justify-start gap-3"
                      >
                        <SearchIcon className="text-muted-foreground size-4" />
                        <span>{item}</span>
                      </Button>
                    ))}
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-row gap-x-2 gap-y-4 flex-wrap justify-start mt-4">
            <Button variant={"outline"} size={"sm"} rounded className="px-4">
              <FileSpreadsheet />
              <span>Spreadsheet</span>
            </Button>
            <Button variant={"outline"} size={"sm"} rounded className="px-4">
              <FileText />
              <span>Import Document</span>
            </Button>
            <Button variant={"outline"} size={"sm"} rounded className="px-4">
              <ImageIcon />
              <span>Import Image</span>
            </Button>
            <Button variant={"outline"} size={"sm"} rounded className="px-4">
              <VideoIcon />
              <span>Youtube</span>
            </Button>
          </div>
        </div>
      </motion.div>
      
      {messages?.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col gap-4 my-28"
        >
          <h1 className="font-medium text-xl">Recent Question Sets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages?.map((message) => (
              <Link key={message.id} href={`/dashboard/question/generate/${message.id}`}>
                <Card className="p-4 relative group">
                  <ArrowUpRight className="absolute top-2 right-2 size-4 text-muted-foreground/20 group-hover:text-foreground" />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium line-clamp-1">
                      {message.title || "Untitled Question Set"}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {new Date(message.updatedAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};

export default Page;
