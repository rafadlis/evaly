import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Submission } from "./types";

export const columns: ColumnDef<Submission>[] = [
    {
        accessorKey: "rank",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 mx-auto"
                >
                    Rank
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">#{row.original.rank}</div>
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2"
                >
                    Participant
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.email}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "score",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 mx-auto"
                >
                    Score
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.score}%</div>
        },
    },
    {
        accessorKey: "answered",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 mx-auto"
                >
                    Answered
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.original.answered}</div>
        },
    },
    {
        accessorKey: "correct",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 mx-auto"
                >
                    Correct
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center text-green-600">{row.original.correct}</div>
        },
    },
    {
        accessorKey: "wrong",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 mx-auto"
                >
                    Wrong
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center text-red-600">{row.original.wrong}</div>
        },
    },
    {
        accessorKey: "unanswered",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 mx-auto"
                >
                    Unanswered
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center text-muted-foreground">{row.original.unanswered}</div>
        },
    },
    {
        accessorKey: "submittedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 flex items-center gap-1 hover:bg-muted px-2 ml-auto"
                >
                    Submitted At
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-1 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = dayjs(row.original.submittedAt);
            return (
                <div className="space-y-1 text-right">
                    <div>{date.format('MMM D, YYYY HH:mm')}</div>
                    <div className="text-xs text-muted-foreground">
                        {date.fromNow()}
                    </div>
                </div>
            )
        },
    },
]; 