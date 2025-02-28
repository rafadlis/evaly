import { Card } from "@/components/ui/card";
import { testSession } from "@/lib/db/schema/test.session";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleHelp, ClockIcon, Trash2Icon } from "lucide-react";
import DialogDeleteSession from "../dialog/dialog-delete-session";
import { Button } from "@/components/ui/button";

const CardSession = ({
  data,
  isSelected,
  onClick,
  onDeleteSuccess,
}: {
  data?: typeof testSession.$inferSelect;
  onClick?: () => void;
  isSelected?: boolean;
  onDeleteSuccess?: () => void;
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
        {data.duration ? (
          <span className="flex flex-row gap-1 items-center">
            <ClockIcon size={14} />{" "}
            {Math.floor(data.duration / 60) > 0
              ? `${Math.floor(data.duration / 60)}h `
              : ""}
            {data.duration % 60}m
          </span>
        ) : (
          <span className="flex flex-row gap-1 items-center">
            <ClockIcon size={14} />
            0m
          </span>
        )}
        <span className="flex flex-row gap-1 items-center">
          <CircleHelp size={14} /> 0 Questions
        </span>
      </div>
      <DialogDeleteSession
        sessionId={data.id}
        onSuccess={() => {
          onDeleteSuccess?.();
        }}
        dialogTrigger={
          <Button
            size={"icon-xxs"}
            variant={"outline"}
            className="absolute bottom-2 right-2 opacity-0 group-hover/session:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Trash2Icon />
          </Button>
        }
      />
    </Card>
  );
};

export default CardSession;
