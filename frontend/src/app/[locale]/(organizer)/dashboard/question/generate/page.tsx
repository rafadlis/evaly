"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Loader2,
  Paperclip,
  SearchIcon,
  VideoIcon,
  Wand2Icon,
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
          `/dashboard/question/generate/${data.id}?initialMessage=${message}`
        );
      });

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

  return (
    <div className="container flex-1 -mt-14 justify-center flex flex-col">
      {/* Prompt Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{ duration: 0.3 }}
        className="flex-col flex items-center"
      >
        <h1 className="text-4xl font-bold mb-8 relative text-primary">
          Let&apos;s Craft Your Question
        </h1>
        <div className="max-w-2xl w-full">
          <div className="relative">
            <Textarea
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter prompt or paste content to generate questions..."
              className={cn(
                "w-full h-[120px] overflow-clip text-sm md:text-base p-4 rounded-xl [&::placeholder]:whitespace-pre-wrap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:border-foreground/20 shadow-none transition-all duration-200",
                autoComplete.length > 0
                  ? "focus-visible:border-b-transparent rounded-b-none"
                  : ""
              )}
            />
            <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-between w-full">
              <div className="flex flex-row gap-2 items-center justify-center">
               
              </div>
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
                    <ArrowRight className="size-4 stroke-3 text-muted-foreground" />
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
          <div className="flex flex-row gap-x-2 gap-y-4 flex-wrap justify-center mt-4">
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

      {/* <div className="flex flex-col gap-4 mt-28">
        <h1 className="font-medium">Latest</h1>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-4">
              <CardHeader>
                <CardTitle>Question {index + 1}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Page;
