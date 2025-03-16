import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Submission } from "./types";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

// Consistent header component to ensure all headers look the same
const SortableHeader = ({
  column,
  title,
}: {
  column: Column<Submission, unknown>;
  title: string;
}) => (
  <Button
    variant="ghost"
    size={"sm"}
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="font-medium w-max text-sm h-8"
  >
    {title}
    <ArrowUpDown  />
  </Button>
);

export const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => <SortableHeader column={column} title="Rank" />,
    cell: ({ row }) => (
      <div className="text-center font-medium">#{row.original.rank}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} title="Participant" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.email}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => <SortableHeader column={column} title="Score" />,
    cell: ({ row }) => {
      const score = row.original.score as number;

      return <div className={cn("text-center")}>{`${score}%`}</div>;
    },
  },
  {
    accessorKey: "answered",
    header: ({ column }) => <SortableHeader column={column} title="Answered" />,
    cell: ({ row }) => {
      const answered = row.original.answered as number;
      const totalQuestions = row.original.totalQuestions;
      return (
        <div className="text-center">
          {answered}/{totalQuestions}
        </div>
      );
    },
  },
  {
    accessorKey: "correct",
    header: ({ column }) => <SortableHeader column={column} title="Correct" />,
    cell: ({ row }) => {
      const correct = row.original.correct as number;
      const totalQuestions = row.original.totalQuestions;
      return (
        <div className="text-center text-green-600">
          {correct}/{totalQuestions}
        </div>
      );
    },
  },
  {
    accessorKey: "wrong",
    header: ({ column }) => <SortableHeader column={column} title="Wrong" />,
    cell: ({ row }) => {
      const wrong = row.original.wrong as number;
      const totalQuestions = row.original.totalQuestions;
      return (
        <div className="text-center text-red-600">
          {wrong}/{totalQuestions}
        </div>
      );
    },
  },
  {
    accessorKey: "unanswered",
    header: ({ column }) => (
      <SortableHeader column={column} title="Unanswered" />
    ),
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.unanswered}
      </div>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => {
      const submittedAt = row.getValue("submittedAt") as string | null;
      const startedAt = row.original.startedAt as string | null;
      const status = row.original.status;

      if (status === "in-progress" && startedAt) {
        return (
          <div className="flex flex-col items-end">
            <p className="text-amber-500 animate-pulse font-medium">
              In progress
            </p>
            <p className="text-xs text-muted-foreground">
              Started {dayjs(startedAt).fromNow()}
            </p>
          </div>
        );
      }

      return submittedAt ? (
        <div className="text-end">
          <p className="font-medium">
            {dayjs(submittedAt).format("DD MMM YYYY HH:mm")}
          </p>
          <p className="text-xs text-muted-foreground">
            Submitted {dayjs(submittedAt).fromNow()}
          </p>
        </div>
      ) : (
        <div className="text-end text-muted-foreground">Not submitted</div>
      );
    },
  },
];
