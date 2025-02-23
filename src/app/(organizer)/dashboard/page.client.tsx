"use client";
import DialogCreateTest from "@/components/shared/dialog/dialog-create-test";
import { Label } from "@/components/ui/label";
import { trpc } from "@/trpc/trpc.client";
import { Link } from "@/components/shared/progress-bar";
import { parseAsInteger, useQueryStates } from "nuqs";
import dayjs from "dayjs";
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
      <div className="flex flex-col mt-10 min-h-dvh">
        {tests.map((e) => (
          <Link
            href={`/dashboard/tests/${e.id}/edit`}
            key={e.id}
            className="flex flex-row px-3 py-2 hover:bg-secondary -mx-3 rounded-md transition-colors"
          >
            <div className="flex flex-col">
              <h1>{e.title || "Untitled test"}</h1>
              <div>
                <Label className="text-sm">
                  Edited {dayjs(e.updatedAt).format("MMM DD")}
                </Label>
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
