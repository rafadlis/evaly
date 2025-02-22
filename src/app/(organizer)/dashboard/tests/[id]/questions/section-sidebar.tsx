import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClockIcon, PlusIcon } from "lucide-react";
import { useSelectedSession } from "./use-selected-session";

const SectionSidebar = ({ className }: { className?: string }) => {
  const questionGroup = Array.from({ length: 5 }, (_, i) => i + 1);
  const [selectedSession, setSelectedSession] = useSelectedSession()

  return (
    <div className={cn("w-2xs sticky top-8 h-max", className)}>
      <div className="flex flex-col rounded-xl overflow-clip">
        {questionGroup.map((e) => (
          <div
            key={e}
            onClick={() => {
              setSelectedSession(e);
            }}
            className={cn(
              "w-full flex flex-col relative items-start group/session transition-all duration-100 justify-start cursor-pointer pl-4 py-4 border-l",
              selectedSession === e
                ? "border-l-4 border-foreground bg-secondary"
                : "hover:bg-secondary/50 active:bg-secondary active:border-l-4"
            )}
          >
            <span className="text-sm font-medium">1. Untitled Session</span>
            <div className="text-muted-foreground text-xs mt-2 flex flex-row gap-2 flex-wrap">
              <Button
                variant={"outline"}
                size={"xxs"}
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Child button clicked");
                }}
              >
                20 Questions
              </Button>
              <Button
                variant={"outline"}
                size={"xxs"}
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Child button clicked");
                }}
              >
                <ClockIcon /> 40 Min
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start mt-4">
        <Button className="w-max">
          <PlusIcon /> Add Session
        </Button>
      </div>
    </div>
  );
};

export default SectionSidebar;
