import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck, ClockIcon, PlusIcon } from "lucide-react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import { Card } from "@/components/ui/card";

const SectionSidebar = ({ className }: { className?: string }) => {
  const questionGroup = Array.from({ length: 5 }, (_, i) => i + 1);
  const [selectedSession, setSelectedSession] = useSelectedSession();

  return (
    <div className={cn("w-[240px] sticky top-4 h-max", className)}>
      <div className="flex flex-col gap-2">
        {questionGroup.map((e) => (
          <Card
            key={e}
            onClick={() => {
              setSelectedSession(e);
            }}
            className={cn(
              "flex flex-col group/session relative transition-all duration-100 justify-start cursor-pointer p-4",
              selectedSession === e ? "border-foreground/20 bg-secondary" : "hover:bg-secondary/50"
            )}
          >
            {selectedSession === e ? (
              <div className="absolute top-2 right-2 text-muted-foreground">
                <CircleCheck size={16} strokeWidth={2.5} />
              </div>
            ) : null}
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
          </Card>
        ))}
      </div>
      <div className="flex flex-col items-start mt-4">
        <Button variant={"outline"} className="w-max">
          <PlusIcon /> Add Session
        </Button>
      </div>
    </div>
  );
};

export default SectionSidebar;
