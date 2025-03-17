import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleHelp, ClockIcon, Trash2Icon } from "lucide-react";
import DialogDeleteSection from "../dialog/dialog-delete-section";
import { Button } from "@/components/ui/button";
import { TestSection } from "@evaly/backend/types/test";

const CardSection = ({
  data,
  isSelected,
  onClick,
  onDeleteSuccess,
  isLastSection,
}: {
  data?: TestSection
  onClick?: () => void;
  isSelected?: boolean;
  onDeleteSuccess?: () => void;
  isLastSection?: boolean;
}) => {
  if (!data) return null;
  return (
    <Card
      key={data.id}
      onClick={onClick}
      className={cn(
        "flex flex-col group/section justify-start  cursor-pointer p-3 relative select-none",
        isSelected
          ? "border-dashed border-foreground/20"
          : "hover:bg-secondary/50 border-border/50 border-dashed"
      )}
    >
      {isSelected ? (
        <div className="absolute top-2 right-2 text-muted-foreground">
          <CircleCheck size={16} strokeWidth={2.5} />
        </div>
      ) : null}
      <span className="text-sm font-medium">
        {data.order}. {data.title || `Section ${data.order}`}
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
          <CircleHelp size={14} /> {JSON.stringify(data.numOfQuestions)} Questions
        </span>
      </div>
      <DialogDeleteSection
        sectionId={data.id}
        onSuccess={() => {
          onDeleteSuccess?.();
        }}
        isLastSection={isLastSection}
        dialogTrigger={
          <Button
            size={"icon-xxs"}
            variant={"outline"}
            className="absolute bottom-2 right-2 opacity-0 group-hover/section:opacity-100 transition-opacity"
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

export default CardSection;
