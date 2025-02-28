"use client";
import DialogCreateTest from "@/components/shared/dialog/dialog-create-test";
import { trpc } from "@/trpc/trpc.client";
import { Link } from "@/components/shared/progress-bar";
import { parseAsInteger, useQueryStates } from "nuqs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import LoadingTest from "@/components/shared/loading/loading-test";
import {
  Calendar,
  Clock,
  MoreHorizontal,
  PencilLine,
  Trash2Icon,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

const DashboardPageClient = () => {
  const [queryStates, setQueryStates] = useQueryStates({
    limit: parseAsInteger.withDefault(15),
    page: parseAsInteger.withDefault(1),
  });

  const { data, isPending } = trpc.organization.tests.all.useQuery({
    ...queryStates,
  });

  const tests = data?.data;
  const pagination = data?.pagination;

  if (isPending) {
    return (
      <div className="container">
        <div className="flex flex-row items-start justify-between mb-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <DialogCreateTest />
        </div>
        <LoadingTest />
      </div>
    );
  }

  if (!tests || tests?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh text-center">
        <h1 className="text-xl font-semibold">No tests yet</h1>
        <h2 className="max-w-sm mt-2 text-muted-foreground mb-4">
          Create your first test and make assessment a breeze. Start building
          engaging questions today!
        </h2>
        <DialogCreateTest />
      </div>
    );
  }
  return (
    <div className="container">
      <div className="flex flex-row items-start justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DialogCreateTest />
      </div>
      <div className="flex flex-col mt-10 min-h-dvh gap-4">
        {tests.map((e) => (
          <Link href={`/dashboard/tests/${e.id}/edit`} key={e.id}>
            <div
              key={e.id}
              className="p-4 border rounded-xl transition-all bg-background w-full hover:border-foreground/50 active:border-foreground"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">
                    {e.title || "Untitled Test"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <Badge variant={"secondary"}>{e.type}</Badge>
                    <Badge variant={"ghost"}>
                      <Clock size={14} />
                      <span>10m</span>
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs rounded-full`}>
                    Active
                  </span>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm pt-2 border-t mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>10 participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16}  />
                  <span>Created on {dayjs(e.createdAt).format("DD MMM YYYY")}</span>
                </div>

                <div className="ml-auto flex gap-1">
                  <Button variant={"ghost"} size={"icon-xs"} rounded={false}>
                    <PencilLine />
                  </Button>
                  <Separator orientation="vertical" />
                  <Button variant={"ghost"} size={"icon-xs"} rounded={false}>
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pagination?.totalPages && pagination?.totalPages > 1 ? (
        <>
          <Separator className="my-8" />
          <Pagination className="mt-8 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination.page > 1) {
                      setQueryStates(
                        (prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }),
                        { scroll: true }
                      );
                    }
                  }}
                  disabled={pagination.page <= 1}
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => {
                      setQueryStates(
                        (prev) => ({
                          ...prev,
                          page: pageNum,
                        }),
                        { scroll: true }
                      );
                    }}
                    isActive={pageNum === pagination.page}
                    disabled={pageNum === pagination.page}
                    className={
                      pageNum === pagination.page ? "disabled:opacity-100" : ""
                    }
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (pagination.page < pagination.totalPages) {
                      setQueryStates(
                        (prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }),
                        { scroll: true }
                      );
                    }
                  }}
                  disabled={pagination.page >= pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : null}
    </div>
  );
};

export default DashboardPageClient;
