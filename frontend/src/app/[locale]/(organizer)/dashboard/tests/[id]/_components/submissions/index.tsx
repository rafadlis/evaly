import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    Search,
    Info,
    Filter,
    Loader2,
    RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "nuqs";

import { Submission, Section } from "./types";
import { SubmissionDrawer } from "./submission-drawer";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useTestSubmissionsById } from "@/query/organization/test/use-test-submissions-byid";

dayjs.extend(relativeTime);

const Submissions = () => {
    const params = useParams();
    const testId = params.id as string;

    // Use nuqs for state management
    const [searchQuery, setSearchQuery] = useQueryState("search", { defaultValue: "" });
    const [selectedSection, setSelectedSection] = useQueryState("section", { defaultValue: "all" });
    const [pageSize, setPageSize] = useQueryState("pageSize", { 
        defaultValue: "20",
        parse: (value) => value,
        serialize: (value) => value
    });
    const [pageIndex, setPageIndex] = useQueryState("page", { 
        defaultValue: "0",
        parse: (value) => value,
        serialize: (value) => value
    });
    const [sortColumn, setSortColumn] = useQueryState("sortColumn", { defaultValue: "" });
    const [sortDirection, setSortDirection] = useQueryState("sortDirection", { defaultValue: "" });
    
    // Local state for selected submission
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    // Fetch submissions data using the provided query hook
    const { data, isLoading, error, refetch, isFetching } = useTestSubmissionsById(testId);
    
    // Extract submissions and sections from the response
    const submissions: Submission[] = useMemo(() => {
        if (!data?.submissions) return [];
        
        return data.submissions.map(submission => {
            // Use the original string ID but remove the prefix for display
            const numericId = parseInt(submission.id.replace(/^ta-/, ''), 36) || 0;
            
            return {
                id: numericId,
                name: submission.name,
                email: submission.email,
                totalQuestions: submission.totalQuestions,
                answered: submission.answered,
                correct: submission.correct,
                wrong: submission.wrong,
                unanswered: submission.unanswered,
                submittedAt: submission.submittedAt,
                score: submission.score,
                rank: submission.rank || 0,
                // Use the original section ID strings for filtering
                sectionId: submission.sectionAnswers ? Object.keys(submission.sectionAnswers)[0] || "all" : "all",
                // Keep section data as original string IDs
                sectionAnswers: submission.sectionAnswers || {},
                sectionCorrect: submission.sectionCorrect || {},
                sectionWrong: submission.sectionWrong || {},
            };
        });
    }, [data?.submissions]);
    
    const sections: Section[] = useMemo(() => {
        if (!data?.sections) return [];
        
        return data.sections.map(section => ({
            // Keep the original string ID
            id: section.id,
            name: section.name,
            questionsCount: section.questionsCount,
        }));
    }, [data?.sections]);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Get unique sections from submissions
    const sectionsWithAll = useMemo(() => {
        // If there's only one section, just return that section
        if (sections.length === 1) {
            return sections;
        }
        
        // Otherwise return all sections with an "All Sections" option
        return [{ id: "all", name: "All Sections", questionsCount: 0 }, ...sections];
    }, [sections]);

    // Filter data based on section and search query
    const filteredData = useMemo(() => {
        let filtered = submissions;

        // Filter by section if not "all"
        if (selectedSection !== "all") {
            filtered = filtered.filter(submission => {
                // Check if this submission has answers for the selected section
                return submission.sectionAnswers && 
                       Object.keys(submission.sectionAnswers).includes(selectedSection);
            });
        }

        // Filter by search query
        if (debouncedSearchQuery) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(submission => {
                return submission.name.toLowerCase().includes(query) ||
                       submission.email.toLowerCase().includes(query);
            });
        }

        return filtered;
    }, [submissions, debouncedSearchQuery, selectedSection]);

    // Calculate ranks based on score (if not already provided by the API)
    const dataWithRanks = useMemo(() => {
        // If the API already provides ranks, use those
        if (submissions.length > 0 && submissions[0].rank) {
            return filteredData;
        }
        
        // Otherwise, calculate ranks based on score
        const sortedByScore = [...filteredData].sort((a, b) => b.score - a.score);
        return sortedByScore.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
    }, [filteredData, submissions]);

    // Handle pagination state changes
    const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
        setPageIndex(String(newPageIndex));
        setPageSize(String(newPageSize));
    };

    // Handle sorting state changes
    const handleSortingChange = (columnId: string, direction: 'asc' | 'desc' | '') => {
        setSortColumn(columnId);
        setSortDirection(direction);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setPageIndex("0");
    }, [selectedSection, debouncedSearchQuery, setPageIndex]);

    // Handle manual refresh
    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading submissions...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-destructive">
                <p className="mb-4">Error loading submissions. Please try again.</p>
                <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium tracking-tight">Submissions</h2>
                    <span className="text-sm text-muted-foreground">
                        Total: {dataWithRanks.length}
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
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRefresh} 
                        disabled={isFetching}
                        className="ml-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {sectionsWithAll.length > 1 && (
                        <Select
                            value={selectedSection}
                            onValueChange={setSelectedSection}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {sections.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {sectionsWithAll.length === 1 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Filter className="h-4 w-4" />
                            {sectionsWithAll[0].name}
                        </div>
                    )}
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
            </div>

            <DataTable 
                columns={columns} 
                data={dataWithRanks} 
                onRowClick={setSelectedSubmission}
                pageIndex={Number(pageIndex)}
                pageSize={Number(pageSize)}
                onPaginationChange={handlePaginationChange}
                sortColumn={sortColumn}
                sortDirection={sortDirection as 'asc' | 'desc' | ''}
                onSortingChange={handleSortingChange}
            />

            <SubmissionDrawer 
                submission={selectedSubmission}
                open={!!selectedSubmission}
                onOpenChange={(open) => !open && setSelectedSubmission(null)}
                sections={sections}
            />
        </div>
    );
};

export default Submissions; 