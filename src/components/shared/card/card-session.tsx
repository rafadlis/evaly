import { Card } from "@/components/ui/card";
import { testSession } from "@/lib/db/schema/test.session";
import { cn } from "@/lib/utils";
import {
  CircleCheck,
  CircleHelp,
  ClockIcon,
  Trash2Icon
} from "lucide-react";
import DialogDeleteSession from "../dialog/dialog-delete-session";
import { Button } from "@/components/ui/button";

const CardSession = ({
  data,
  isSelected,
  onClick,
}: {
  data?: typeof testSession.$inferSelect;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  if (!data) return null;
  return (
    <Card
      key={data.id}
      onClick={onClick}
      className={cn(
        "flex flex-col group/session justify-start  cursor-pointer p-3 relative select-none",
        isSelected
          ? "border-foreground/20 bg-secondary"
          : "hover:bg-secondary/50"
      )}
    >
      {isSelected ? (
        <div className="absolute top-2 right-2 text-muted-foreground">
          <CircleCheck size={16} strokeWidth={2.5} />
        </div>
      ) : null}
      <span className="text-sm font-medium">
        {data.order}. {data.title || "Untitled Session"}
      </span>
      <div className="text-muted-foreground text-xs mt-2 flex flex-row gap-3 flex-wrap">
        <span className="flex flex-row gap-1 items-center">
          <ClockIcon size={14} /> {data.duration} Min
        </span>
        <span className="flex flex-row gap-1 items-center">
          <CircleHelp size={14} /> 0 Questions
        </span>
      </div>
      <DialogDeleteSession
        dialogTrigger={
          <Button size={"icon-xxs"} variant={"outline"} className="absolute bottom-2 right-2 opacity-0 group-hover/session:opacity-100 transition-opacity duration-300">
            <Trash2Icon />
          </Button>
        }
      />
    </Card>
  );
};


export default CardSession;
