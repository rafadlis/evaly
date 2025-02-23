import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { testSession } from "@/lib/db/schema/test.session";
import { cn } from "@/lib/utils";
import { CircleCheck, ClockIcon } from "lucide-react";

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
        "flex flex-col group/session relative justify-start  cursor-pointer p-3",
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
      <div className="text-muted-foreground text-xs mt-2 flex flex-row gap-2 flex-wrap">
        <Badge variant={"secondary"}>0 Questions</Badge>
        <Badge variant={"secondary"}>
          <ClockIcon /> {data.duration} Min
        </Badge>
      </div>
    </Card>
  );
};

export default CardSession;
