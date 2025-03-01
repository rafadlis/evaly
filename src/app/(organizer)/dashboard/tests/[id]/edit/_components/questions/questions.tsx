import { Button } from "@/components/ui/button";
import { ListTreeIcon, ListXIcon, Loader2, PlusIcon } from "lucide-react";
import CardQuestion from "./card-question";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionSidebar from "./section-sidebar";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useState } from "react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import { trpc } from "@/trpc/trpc.client";
import DialogDeleteSession from "@/components/shared/dialog/dialog-delete-session";
import { Skeleton } from "@/components/ui/skeleton";
import DialogEditSessionDuration from "@/components/shared/dialog/dialog-edit-session-duration";
import DialogEditSession from "@/components/shared/dialog/dialog-edit-session";
import { Question } from "@/lib/db/schema/question";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import { cn } from "@/lib/utils";
import { Reorder } from "motion/react";

const Questions = () => {
  const [selectedSession, setSelectedSession] = useSelectedSession();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const {
    data: dataSession,
    isRefetching: isRefetchingSession,
    isPending: isPendingSession,
    refetch: refetchSession,
  } = trpc.organization.session.byId.useQuery(
    { id: selectedSession as string },
    { enabled: !!selectedSession }
  );

  const {
    refetch: refetchSessions,
    data: dataSessions,
    isRefetching: isRefetchingSessions,
    isPending: isPendingSessions,
  } = trpc.organization.session.sessionByTestId.useQuery(
    { testId: dataSession?.testId as string },
    { enabled: !!dataSession?.testId }
  );

  const {
    data: dataQuestions,
    isRefetching: isRefetchingQuestions,
    refetch: refetchQuestions,
    isPending: isPendingQuestions,
  } = trpc.organization.question.allByReferenceId.useQuery(
    {
      referenceId: selectedSession as string,
    },
    {
      enabled: !!selectedSession,
    }
  );

  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (dataQuestions) {
      setLocalQuestions(dataQuestions);
    }
  }, [dataQuestions]);

  const [hideOptions, setHideOptions] = useState(false);

  const virtualizer = useWindowVirtualizer({
    count: localQuestions?.length || 0,
    estimateSize: () => 200,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const onSuccessDeleteSession = async () => {
    await refetchQuestions();
    await refetchSessions();

    // Find the next available session to select after deletion
    if (dataSessions && dataSessions.length > 0) {
      // Set the first available session as selected
      setSelectedSession(dataSessions[0].id);
    } else {
      // If no sessions left, clear the selection
      setSelectedSession(null);
    }
  };

  return (
    <div className="flex flex-row gap-6">
      <SectionSidebar />
      {isPendingQuestions ? (
        <Skeleton className="flex-1 h-[60vh]" />
      ) : dataSession ? (
        <Card className="border border-dashed overflow-clip flex-1">
          <CardHeader className="sticky top-14 bg-background z-10 pb-4">
            <div className="flex flex-row items-start">
              <CardTitle className="flex-1 flex flex-row flex-wrap items-center gap-2">
                {dataSession?.order}. {dataSession?.title || "Untitled session"}
                <DialogEditSession sessionId={selectedSession as string} />
              </CardTitle>
              <div className="flex flex-row gap-2">
                <Button
                  size={"xs"}
                  variant={hideOptions ? "default" : "outline"}
                  onClick={() => {
                    setHideOptions((prev) => !prev);
                  }}
                >
                  {hideOptions ? (
                    <>
                      <ListTreeIcon />
                      Show Options
                    </>
                  ) : (
                    <>
                      <ListXIcon />
                      Hide Options
                    </>
                  )}
                </Button>

                <DialogEditSessionDuration
                  sessionId={selectedSession as string}
                  onSuccess={() => {
                    refetchSessions();
                    refetchSession();
                  }}
                  disabled={isPendingSession || isRefetchingSession}
                />
                <DialogDeleteSession
                  disabled={
                    isRefetchingQuestions ||
                    isRefetchingSessions ||
                    isPendingQuestions ||
                    isPendingSessions
                  }
                  sessionId={selectedSession as string}
                  onSuccess={() => {
                    onSuccessDeleteSession();
                  }}
                />
              </div>
            </div>
            <CardDescription className="max-w-md flex flex-row items-end gap-2">
              {dataSession?.description || "No description"}
            </CardDescription>
          </CardHeader>
          {localQuestions?.length ? (
            <CardContent className="pt-0">
              <div
                className="relative"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                <Reorder.Group
                  onReorder={(newOrderedQuestions) => {
                    console.log(newOrderedQuestions);
                  }}
                  values={localQuestions}
                  as="div"
                  className={cn(
                    "absolute top-0 left-0 w-full",
                    isRefetchingQuestions ? "animate-pulse" : ""
                  )}
                  style={{
                    transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                  }}
                >
                  {virtualItems.map(({ index }) => {
                    const data = localQuestions?.[index];
                    return (
                      <Reorder.Item
                        value={data}
                        as="div"
                        key={data.id}
                        ref={virtualizer.measureElement}
                        data-index={index}
                        dragListener={false}
                      >
                        <CardQuestion
                          onMoveUp={() => {
                            console.log("move up");
                          }}
                          onMoveDown={() => {
                            console.log("move down");
                          }}
                          hideOptions={hideOptions}
                          data={data}
                          onClickEdit={() => setSelectedQuestion(data)}
                          className={cn(
                            isRefetchingQuestions ? "cursor-progress" : ""
                          )}
                          onDeleteSuccess={() => {
                            const findIndex = localQuestions.findIndex(
                              (q) => q.id === data.id
                            );
                            if (findIndex >= 0) { 
                              setLocalQuestions((prev) => [
                                ...prev.slice(0, findIndex),
                                ...prev.slice(findIndex + 1),
                              ]);
                            }
                          }}
                        />
                        <SeparatorAdd
                          referenceId={dataSession?.id}
                          refetch={refetchQuestions}
                          order={(data.order || 0) + 1}
                        />
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              </div>
            </CardContent>
          ) : (
            <CardContent className="pt-0">
              <EmptyQuestion
                referenceId={dataSession?.id}
                refetch={refetchQuestions}
                isRefetching={isRefetchingQuestions}
              />
            </CardContent>
          )}
        </Card>
      ) : null}
      <DialogEditQuestion
        defaultValue={selectedQuestion}
        onSuccess={(question) => {
          const findIndex = localQuestions.findIndex(
            (q) => q.id === question.id
          );

          // if the question is found, update it
          if (findIndex >= 0) {
            setSelectedQuestion(question);
            setLocalQuestions((prev) => [
              ...prev.slice(0, findIndex),
              question,
              ...prev.slice(findIndex + 1),
            ]);
          }
        }}
        onClose={() => {
          setSelectedQuestion(null);
        }}
      />
    </div>
  );
};

const SeparatorAdd = ({
  refetch,
  referenceId,
  order,
}: {
  refetch?: () => void;
  referenceId?: string;
  order: number;
}) => {
  const { mutate: createQuestion, isPending: isPendingCreateQuestion } =
    trpc.organization.question.create.useMutation({
      onSuccess() {
        refetch?.();
      },
    });

  const isPending = isPendingCreateQuestion;

  return (
    <div className="h-8 flex items-center justify-center group/separator relative">
      <Button
        disabled={isPending}
        size={"xxs"}
        variant={"default"}
        onClick={() => {
          if (referenceId) createQuestion({ referenceId, order });
        }}
        className="absolute opacity-30 lg:opacity-0 group-hover/separator:opacity-100"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <PlusIcon />} Add
        Question
      </Button>
      <div className="h-auto border-b border-border/50 border-dashed w-full group-hover/separator:border-solid group-hover/separator:border-border" />
    </div>
  );
};

const EmptyQuestion = ({
  refetch,
  referenceId,
  isRefetching,
}: {
  refetch?: () => void;
  referenceId?: string;
  isRefetching?: boolean;
}) => {
  const { mutate: createQuestion, isPending: isPendingCreateQuestion } =
    trpc.organization.question.create.useMutation({
      onSuccess() {
        refetch?.();
      },
    });

  const isPending = isPendingCreateQuestion || isRefetching;

  return (
    <div className="border rounded-lg flex flex-col justify-center items-center py-16 border-dashed gap-4">
      <h1>No question found on this session</h1>
      <Button
        disabled={isPending}
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          if (referenceId) createQuestion({ referenceId, order: 1 });
        }}
        className=""
      >
        {isPending ? <Loader2 className="animate-spin" /> : <PlusIcon />} Add
        Question
      </Button>
    </div>
  );
};
export default Questions;
