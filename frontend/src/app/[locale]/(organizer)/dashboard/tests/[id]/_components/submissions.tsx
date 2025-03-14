import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDebounce } from "@/hooks/use-debounce";

dayjs.extend(relativeTime);

type Submission = {
    id: number;
    name: string;
    email: string;
    totalQuestions: number;
    answered: number;
    correct: number;
    wrong: number;
    unanswered: number;
    submittedAt: string;
    score: number;
};

type SortConfig = {
    key: keyof Submission | null;
    direction: 'asc' | 'desc';
};

// This will be replaced with real data later
const mockData = Array.from({ length: 30 }, (_, index) => {
    const totalQuestions = 10;
    const answered = Math.floor(Math.random() * (totalQuestions + 1));
    const correct = Math.floor(Math.random() * (answered + 1));
    const wrong = answered - correct;
    const unanswered = totalQuestions - answered;
    const score = Math.floor((correct / totalQuestions) * 100);

    // Generate random time within the last 24 hours
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));

    return {
        id: index + 1,
        name: [
            "John Doe", "Jane Smith", "Alex Johnson", "Maria Garcia", "David Lee",
            "Sarah Wilson", "Michael Brown", "Emma Davis", "James Miller", "Lisa Anderson",
            "Robert Taylor", "Patricia Moore", "Daniel White", "Jennifer Martin", "William Thompson",
            "Elizabeth Jackson", "Richard Martinez", "Susan Robinson", "Joseph Clark", "Margaret Rodriguez",
            "Thomas Wright", "Linda Walker", "Charles Hall", "Barbara Young", "Christopher King",
            "Michelle Scott", "Kenneth Green", "Sandra Adams", "Steven Baker", "Dorothy Nelson"
        ][index],
        email: `participant${index + 1}@example.com`,
        totalQuestions,
        answered,
        correct,
        wrong,
        unanswered,
        submittedAt: date.toISOString(),
        score,
    };
}).sort((a, b) => b.score - a.score); // Pre-sort by score for initial ranking

type Column = {
    key: keyof Submission;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    render?: (value: Submission[keyof Submission], submission: Submission) => React.ReactNode;
    searchable?: boolean;
};

const Submissions = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'score',
        direction: 'desc'
    });

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const filteredData = useMemo(() => {
        if (!debouncedSearchQuery) return mockData;

        return mockData.filter(submission => {
            return submission.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                   submission.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        });
    }, [debouncedSearchQuery]);

    const sortedAndFilteredData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
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
    }, [sortConfig, filteredData]);

    const columns: Column[] = useMemo(() => [
        {
            key: 'id',
            label: 'Rank',
            width: 'min-w-[80px]',
            align: 'center',
            render: (_, submission) => {
                const rank = sortedAndFilteredData.findIndex(item => item.id === submission.id) + 1;
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
    ], [sortedAndFilteredData]);

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
                <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
                <div className="flex items-center gap-4">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search participants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Badge variant="secondary">
                        Total: {sortedAndFilteredData.length}
                    </Badge>
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
                                    <TableRow key={submission.id}>
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
        </div>
    );
};

export default Submissions;