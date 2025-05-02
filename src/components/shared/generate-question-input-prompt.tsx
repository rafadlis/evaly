import { AnimatePresence, motion } from "motion/react";
import { TextLoop } from "../ui/text-loop";
import {
  ArrowRight,
  Brain,
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
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { KeyboardEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTranslations } from "next-intl";
import { trpc } from "@/trpc/trpc.client";
import { useProgressRouter } from "./progress-bar";
interface Props {
  className?: string;
  order?: number;
  referenceId?: string;
  testId?: string;
}

const GenerateQuestionInputPrompt = ({
  className,
  order,
  referenceId,
  testId,
}: Props) => {
  const autoComplete: string[] = [];
  const router = useProgressRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("Questions");
  // const searchParams = useSearchParams()

  // const referenceId = searchParams.get("templateId");
  // const showImportSection = searchParams.get("showImportSection");

  const { mutate: startGeneration, isPending: isGenerating } =
    trpc.organization.question.llmValidate.useMutation({
      onSuccess: (data) => {
        if (!data) {
          toast.error(t("failedToGenerateQuestions"), {
            position: "top-center",
          });
          return;
        }

        if (!data.isValid) {
          toast.error(data.suggestion, {
            position: "top-center",
          });
          return;
        }

        if (!data.templateCreated) {
          toast.error(t("failedToCreateTemplate"), {
            position: "top-center",
          });
          return;
        }

        startTransition(() => {
          if (testId) {
            router.push(
              `/dashboard/question/generate/${data.templateCreated?.id}?order=${order}&referenceid=${referenceId}&testid=${testId}`,
              { scroll: true }
            );
          } else {
            router.push(
              `/dashboard/question/generate/${data.templateCreated?.id}`,
              { scroll: true }
            );
          }
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const { mutate: improvePrompt, isPending: isPendingImprovePrompt } =
    trpc.organization.question.improvePrompt.useMutation({
      onSuccess: (data) => {
        setInputValue(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    startGeneration({ prompt: inputValue });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("flex-col flex items-center", className)}
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
          <WandSparkles className="size-3 inline" />{" "}
          {t("letsCraftYourQuestion")}
        </span>
        <span>
          <Lightbulb className="size-3 inline" /> {t("turnIdeasIntoInquiries")}
        </span>
        <span>
          <Brain className="size-3 inline" />{" "}
          {t("designThoughtProvokingQuestions")}
        </span>
        <span>
          <Rocket className="size-3 inline" /> {t("createEngagingChallenges")}
        </span>
        <span>
          <Search className="size-3 inline" />{" "}
          {t("sparkCuriosityWithQuestions")}
        </span>
        <span>
          <RefreshCw className="size-3 inline" />{" "}
          {t("transformConceptsIntoQueries")}
        </span>
      </TextLoop>
      <div className="max-w-2xl w-full">
        <div className="relative">
          <Textarea
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("promptPlaceholder")}
            className={cn(
              "w-full min-h-[120px] border-border focus-visible:border-border overflow-clip text-sm md:text-base p-4 [&::placeholder]:whitespace-pre-rap resize-none focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0 transition-all duration-200",
              autoComplete.length > 0
                ? "focus-visible:border-b-transparent rounded-b-none"
                : ""
            )}
          />
          <div className="absolute bottom-0 left-0 p-2 flex flex-row gap-2 items-center justify-between w-full">
            <div className="flex flex-row gap-2 items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon-sm"}
                    variant={"ghost"}
                    onClick={() => {
                      improvePrompt(inputValue);
                    }}
                    disabled={inputValue.length < 5 || isPendingImprovePrompt}
                  >
                    <Wand2Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("improvePrompt")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size={"icon-sm"} variant={"ghost"}>
                    <Paperclip />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("attachFiles")}</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-row items-center justify-center gap-1">
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
            <span>{t("spreadsheet")}</span>
          </Button>
          <Button variant={"outline"} size={"sm"} rounded className="px-4">
            <FileText />
            <span>{t("importDocument")}</span>
          </Button>
          <Button variant={"outline"} size={"sm"} rounded className="px-4">
            <ImageIcon />
            <span>{t("importImage")}</span>
          </Button>
          <Button variant={"outline"} size={"sm"} rounded className="px-4">
            <VideoIcon />
            <span>{t("youtube")}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GenerateQuestionInputPrompt;
