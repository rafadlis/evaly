import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Submission } from "./types";

dayjs.extend(relativeTime);

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
            const status = row.original.status || (row.original.submittedAt ? 'completed' : 'in-progress');
            
            return (
                <div className="flex items-center gap-2">
                    {status === 'in-progress' ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Clock className="h-4 w-4 text-amber-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>In progress</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Completed</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <div>
                        <div className="font-medium">{row.original.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {row.original.email}
                        </div>
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
            const score = row.original.score as number;
            const status = row.original.status || (row.original.submittedAt ? 'completed' : 'in-progress');
            
            return (
                <div className="flex items-center">
                    <Badge 
                        variant={status === 'in-progress' ? "outline" : (score >= 70 ? "default" : "destructive")}
                        className={status === 'in-progress' ? "border-amber-500 text-amber-500" : ""}
                    >
                        {status === 'in-progress' ? 'In progress' : `${score}%`}
                    </Badge>
                </div>
            )
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
            const answered = row.original.answered as number;
            const totalQuestions = row.original.totalQuestions;
            return (
                <div>
                    {answered}/{totalQuestions}
                </div>
            )
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
            const correct = row.original.correct as number;
            const totalQuestions = row.original.totalQuestions;
            return (
                <div className="text-green-600">
                    {correct}/{totalQuestions}
                </div>
            )
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
            const wrong = row.original.wrong as number;
            const totalQuestions = row.original.totalQuestions;
            return (
                <div className="text-red-600">
                    {wrong}/{totalQuestions}
                </div>
            )
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
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-0 font-medium"
            >
                Submitted
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const submittedAt = row.getValue("submittedAt") as string | null;
            const startedAt = row.original.startedAt as string | null;
            const status = row.original.status;
            
            if (status === 'in-progress' && startedAt) {
                return (
                    <div className="text-amber-500">
                        Started {dayjs(startedAt).fromNow()}
                    </div>
                );
            }
            
            return submittedAt ? (
                <div>{dayjs(submittedAt).fromNow()}</div>
            ) : (
                <div className="text-muted-foreground">Not submitted</div>
            );
        },
    },
]; 