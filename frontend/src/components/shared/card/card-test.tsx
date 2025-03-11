import { Test } from "@evaly/backend/types/test";
import { Link } from "../progress-bar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, PencilLine, Users } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DialogDeleteTest from "../dialog/dialog-delete-test";
import { testTypeColor, testTypeFormatter } from "@/lib/test-type-formatter";
import { toast } from "sonner";

const CardTest = ({ data, onDelete }: { data: Test, onDelete?: () => void }) => {
  const redirectLink = data.isPublished
    ? `/dashboard/tests/${data.id}`
    : `/dashboard/tests/${data.id}/edit`;
  return (
    <Link href={redirectLink}>
      <div
        key={data.id}
        className="p-4 border rounded-xl transition-all bg-background w-full hover:border-foreground/15 active:border-foreground"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">
              {data.title || "Untitled Test"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Badge variant={"secondary"} className={testTypeColor(data.type)}>
                {testTypeFormatter(data.type)}
              </Badge>
              <Badge variant={"ghost"}>
                <Clock size={14} />
                <span>
                  {Number(data.duration || "0") === 0
                    ? "No time limit"
                    : `${data.duration}m`}
                </span>
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data.isPublished ? (
              <Badge
                variant={"default"}
                className="bg-emerald-600/10 text-emerald-600 border border-emerald-600/10"
              >
                Active
              </Badge>
            ) : (
              <Badge variant={"secondary"}>Draft</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm pt-2 border-t mt-2 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>
              {data.access === "public"
                ? "Public"
                : `${data.invitations} participants`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>
              Created on {dayjs(data.createdAt).format("DD MMM YYYY")}
            </span>
          </div>

          <div className="ml-auto flex gap-1">
            <Button variant={"ghost"} size={"icon-xs"}>
              <PencilLine />
            </Button>
            <Separator orientation="vertical" />
            <DialogDeleteTest
              testId={data.id}
              onSuccess={() => {
                toast.success("Test deleted successfully");
                onDelete?.();
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardTest;
