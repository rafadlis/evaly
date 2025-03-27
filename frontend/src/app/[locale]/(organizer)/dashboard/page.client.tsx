"use client";
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
import { FileSpreadsheet } from "lucide-react";
import DialogCreateTest from "@/components/shared/dialog/dialog-create-test";
import { useTestQuery } from "@/query/organization/test/use-test.query";
import CardTest from "@/components/shared/card/card-test";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

const DashboardPageClient = () => {
  const [queryStates, setQueryStates] = useQueryStates({
    limit: parseAsInteger.withDefault(100),
    page: parseAsInteger.withDefault(1),
  });

  const { data, isPending } = useTestQuery(queryStates);
  const queryClient = useQueryClient();

  const tests = data?.data;
  const pagination = data?.pagination;

  if (isPending) {
    return (
      <div className="container">
        <div className="flex flex-row items-start justify-between mb-10">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <DialogCreateTest />
        </div>
        <LoadingTest />
      </div>
    );
  }

  if (!tests || tests?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <FileSpreadsheet className="size-16 text-muted-foreground mb-6" />
        <h1 className="text-xl font-medium">No tests yet</h1>
        <h2 className="max-w-md mt-2 text-muted-foreground mb-4">
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
        <div>
          <h1 className="text-lg font-medium">Dashboard</h1>
          <p className="text-muted-foreground">
            List of all your tests and assessments.
          </p>
        </div>
        <DialogCreateTest />
      </div>
      <div className="flex flex-col mt-10 min-h-dvh gap-4">
        <AnimatePresence>
          {tests.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1 }}
            >
              <CardTest
                data={e}
                key={e.id}
                onDelete={() => {
                  const newData = tests.filter((test) => test.id !== e.id);
                  console.log(newData);
                  queryClient.setQueryData(
                    ["tests", queryStates.limit, queryStates.page],
                    {
                      data: newData,
                      pagination: {
                        ...pagination,
                        totalPages: newData.length,
                      },
                    }
                  );
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
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
