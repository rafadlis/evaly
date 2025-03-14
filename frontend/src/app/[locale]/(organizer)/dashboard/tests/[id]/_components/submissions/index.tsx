import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Info } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";

import { Submission, SortConfig, Column } from "./types";
import { mockSubmissions } from "./mock-data";
import { SubmissionDrawer } from "./submission-drawer";

dayjs.extend(relativeTime);

const Submissions = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'submittedAt',
        direction: 'asc'
    });
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const filteredData = useMemo(() => {
        if (!debouncedSearchQuery) return mockSubmissions;

        return mockSubmissions.filter(submission => {
            return submission.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                   submission.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        });
    }, [debouncedSearchQuery]);

    // Calculate ranks based on score
    const dataWithRanks = useMemo(() => {
        const sortedByScore = [...filteredData].sort((a, b) => b.score - a.score);
        return sortedByScore.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
    }, [filteredData]);

    const sortedAndFilteredData = useMemo(() => {
        if (!sortConfig.key) return dataWithRanks;

        return [...dataWithRanks].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (aValue === bValue) {
                // Secondary sort by score when values are equal
                return b.score - a.score;
            }

            const comparison = (() => {
                if (typeof aValue === 'string') {
                    return aValue.localeCompare(bValue as string);
                }
                return (aValue as number) - (bValue as number);
            })();

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [sortConfig, dataWithRanks]);

    const columns: Column[] = useMemo(() => [
        {
            key: 'id',
            label: 'Rank',
            width: 'min-w-[80px]',
            align: 'center',
            render: (_, submission) => {
                const rank = dataWithRanks.find(item => item.id === submission.id)?.rank;
                return `#${rank}`;
            }
        },
        {
            key: 'name',
            label: 'Participant',
            width: 'min-w-[200px]',
            searchable: true,
            render: (_, submission) => (
                <div>
                    <div className="font-medium">{submission.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {submission.email}
                    </div>
                </div>
            )
        },
        {
            key: 'score',
            label: 'Score',
            width: 'min-w-[100px]',
            align: 'center',
            render: (value) => `${value}%`
        },
        {
            key: 'answered',
            label: 'Answered',
            width: 'min-w-[100px]',
            align: 'center'
        },
        {
            key: 'correct',
            label: 'Correct',
            width: 'min-w-[100px]',
            align: 'center'
        },
        {
            key: 'wrong',
            label: 'Wrong',
            width: 'min-w-[100px]',
            align: 'center'
        },
        {
            key: 'unanswered',
            label: 'Unanswered',
            width: 'min-w-[100px]',
            align: 'center'
        },
        {
            key: 'submittedAt',
            label: 'Submitted At',
            width: 'min-w-[200px]',
            align: 'right',
            render: (value) => {
                const date = dayjs(value as string);
                return (
                    <div className="space-y-1">
                        <div>{date.format('MMM D, YYYY HH:mm')}</div>
                        <div className="text-xs text-muted-foreground">
                            {date.fromNow()}
                        </div>
                    </div>
                )
            }
        }
    ], [dataWithRanks]);

    const handleSort = (key: keyof Submission) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (columnKey: keyof Submission) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="ml-1 h-4 w-4" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-1 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-1 h-4 w-4" />
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium tracking-tight">Submissions</h2>
                    <span className="text-sm text-muted-foreground">
                        Total: {sortedAndFilteredData.length}
                    </span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click on any row to view detailed submission information</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search participants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="relative rounded-md border">
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.key}
                                        className={`${column.width} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                                    >
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort(column.key)}
                                            className={`h-8 ${column.align === 'right' ? 'ml-auto' : column.align === 'center' ? 'mx-auto' : ''} flex items-center gap-1 hover:bg-muted px-2`}
                                        >
                                            {column.label}
                                            {getSortIcon(column.key)}
                                        </Button>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAndFilteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell 
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedAndFilteredData.map((submission) => (
                                    <TableRow 
                                        key={submission.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => setSelectedSubmission(submission)}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.key}
                                                className={`${column.width} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''} ${
                                                    column.key === 'correct' ? 'text-green-600' :
                                                    column.key === 'wrong' ? 'text-red-600' :
                                                    column.key === 'unanswered' ? 'text-muted-foreground' : ''
                                                }`}
                                            >
                                                {column.render ? 
                                                    column.render(submission[column.key], submission) :
                                                    submission[column.key]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <SubmissionDrawer 
                submission={selectedSubmission}
                open={!!selectedSubmission}
                onOpenChange={(open) => !open && setSelectedSubmission(null)}
            />
        </div>
    );
};

export default Submissions; 