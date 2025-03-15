import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    Search,
    Info,
    Filter
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
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "nuqs";

import { Submission } from "./types";
import { mockSubmissions, mockSections } from "./mock-data";
import { SubmissionDrawer } from "./submission-drawer";
import { DataTable } from "./data-table";
import { columns } from "./columns";

dayjs.extend(relativeTime);

const Submissions = () => {
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

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Get unique sections from submissions
    const sections = useMemo(() => {
        // If there's only one section, just return that section
        if (mockSections.length === 1) {
            return mockSections;
        }
        
        // Otherwise return all sections with an "All Sections" option
        return [{ id: 0, name: "All Sections", questionsCount: 0 }, ...mockSections];
    }, []);

    // Filter data based on section and search query
    const filteredData = useMemo(() => {
        let filtered = mockSubmissions;

        // Filter by section if not "all"
        if (selectedSection !== "all") {
            const sectionId = parseInt(selectedSection);
            filtered = filtered.filter(submission => submission.sectionId === sectionId);
        }

        // Filter by search query
        if (debouncedSearchQuery) {
            filtered = filtered.filter(submission => {
                return submission.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                       submission.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
            });
        }

        return filtered;
    }, [debouncedSearchQuery, selectedSection]);

    // Calculate ranks based on score
    const dataWithRanks = useMemo(() => {
        const sortedByScore = [...filteredData].sort((a, b) => b.score - a.score);
        return sortedByScore.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
    }, [filteredData]);

    // Handle pagination state changes
    const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
        setPageIndex(newPageIndex.toString());
        setPageSize(newPageSize.toString());
    };

    // Handle sorting state changes
    const handleSortingChange = (columnId: string, direction: 'asc' | 'desc' | '') => {
        setSortColumn(columnId);
        setSortDirection(direction);
    };

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
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {sections.length > 1 && (
                        <Select
                            value={selectedSection}
                            onValueChange={setSelectedSection}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {mockSections.map((section) => (
                                    <SelectItem key={section.id} value={section.id.toString()}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {sections.length === 1 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Filter className="h-4 w-4" />
                            {sections[0].name}
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
                pageIndex={parseInt(pageIndex)}
                pageSize={parseInt(pageSize)}
                onPaginationChange={handlePaginationChange}
                sortColumn={sortColumn}
                sortDirection={sortDirection as 'asc' | 'desc' | ''}
                onSortingChange={handleSortingChange}
            />

            <SubmissionDrawer 
                submission={selectedSubmission}
                open={!!selectedSubmission}
                onOpenChange={(open) => !open && setSelectedSubmission(null)}
                sections={mockSections}
            />
        </div>
    );
};

export default Submissions; 