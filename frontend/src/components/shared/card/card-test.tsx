import { Test } from "@evaly/backend/types/test";
import { Link } from "../progress-bar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckIcon,
  CircleIcon,
  CircleUserIcon,
  Clock,
  PencilLine,
} from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DialogDeleteTest from "../dialog/dialog-delete-test";
import { testTypeColor, testTypeFormatter } from "@/lib/test-type-formatter";
import { toast } from "sonner";

const CardTest = ({
  data,
  onDelete,
}: {
  data: Test;
  onDelete?: () => void;
}) => {
  const redirectLink = data.isPublished
    ? `/dashboard/tests/${data.id}`
    : `/dashboard/tests/${data.id}/edit`;
  return (
    <Link href={redirectLink}>
      <div
        key={data.id}
        className="border border-dashed transition-all duration-100 bg-background w-full hover:border-primary/30 active:opacity-80"
      >
        <div className="flex justify-between items-start p-4">
          <div>
            <h3 className="font-medium">{data.title || "Untitled Test"}</h3>
          </div>

          <div>
            {data.isPublished && !data.finishedAt ? (
              <Badge variant={"ghost"} className="text-muted-foreground">
                <CircleIcon className="fill-success-foreground stroke-success-foreground size-3" />
                Active
              </Badge>
            ) : null}

            {!data.isPublished && !data.finishedAt ? (
              <Badge variant={"secondary"}>Draft</Badge>
            ) : null}

            {data.isPublished && data.finishedAt ? (
              <Badge variant={"success"}>
                <CheckIcon />
                Finished
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm px-4 py-2 border-dashed border-t text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={"secondary"} className={testTypeColor(data.type)}>
              {testTypeFormatter(data.type)}
            </Badge>
            {Number(data.duration || "0") > 0 ? (
              <Badge variant={"secondary"}>
                <Clock size={14} />
                <span>{`${data.duration}m`}</span>
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <CircleUserIcon size={14} />
            <span>
              {data.access === "public"
                ? "Public"
                : `${data.invitations} participants`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
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
