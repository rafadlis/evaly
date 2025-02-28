import { Button } from "@/components/ui/button";
import {
  ListTreeIcon,
  ListXIcon,
  Loader2,
  PencilLine,
  PlusIcon,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import { trpc } from "@/trpc/trpc.client";
import DialogDeleteSession from "@/components/shared/dialog/dialog-delete-session";
import { Skeleton } from "@/components/ui/skeleton";
import DialogEditSessionDuration from "@/components/shared/dialog/dialog-edit-session-duration";

const Questions = () => {
  const [selectedSession, setSelectedSession] = useSelectedSession();

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

  const [hideOptions, setHideOptions] = useState(false);

  const virtualizer = useWindowVirtualizer({
    count: dataQuestions?.length || 0,
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
                <DialogChangeSessionDetail />
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
                  disabled={
                    isPendingSession ||
                    isRefetchingSession
                  }
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
              <span className="flex-1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
                quas dicta voluptas neque libero velit ullam atque aspernatur!
              </span>
            </CardDescription>
          </CardHeader>
          {dataQuestions?.length ? (
            <CardContent className="pt-0">
              <div
                className="relative"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                  }}
                >
                  {virtualItems.map(({ index }) => {
                    const data = dataQuestions?.[index];
                    return (
                      <div
                        key={data.id}
                        ref={virtualizer.measureElement}
                        data-index={index}
                      >
                        <CardQuestion hideOptions={hideOptions} data={data} />
                        <SeparatorAdd
                          referenceId={dataSession?.id}
                          refetch={refetchQuestions}
                          order={(data.order || 0) + 1}
                        />
                      </div>
                    );
                  })}
                </div>
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

const DialogChangeSessionDetail = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle>Edit Session&apos;s</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input placeholder="Type session's title here..." />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Duration</Label>
          <div className="flex flex-row flex-wrap gap-2">
            <Button rounded={false} size={"xs"} variant={"outline"}>
              5m
            </Button>
            <Button rounded={false} size={"xs"}>
              10m
            </Button>
            <Button rounded={false} size={"xs"} variant={"outline"}>
              25m
            </Button>
            <Button rounded={false} size={"xs"} variant={"outline"}>
              30m
            </Button>
            <Button rounded={false} size={"xs"} variant={"outline"}>
              Custom
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description (Optional)</Label>
          <Textarea placeholder="Type session's description here..." />
        </div>
        <DialogFooter className="mt-0">
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant={"secondary"}
          >
            Back
          </Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
