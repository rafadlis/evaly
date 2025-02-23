import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  ListTreeIcon,
  ListXIcon,
  Loader2,
  PencilLine,
  PlusIcon,
  Trash2Icon,
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

const Questions = () => {
  const [selectedSession] = useSelectedSession();

  const { data: dataSession } =
    trpc.organization.session.byId.useQuery(
      { id: selectedSession as string },
      { enabled: !!selectedSession }
    );

  const {
    data: dataQuestions,
    isRefetching: isRefetchingQuestions,
    refetch: refetchQuestions,
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
    estimateSize: () => 500,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex flex-row gap-6">
      <SectionSidebar />
      <Card className="flex-1 min-h-[70vh] border border-dashed overflow-clip">
        <CardHeader className="sticky top-0 bg-background z-10 pb-4">
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
              <Button size={"xs"} variant={"outline"}>
                <ClockIcon /> 40min
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size={"icon-xs"} variant={"outline"}>
                    <Trash2Icon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure want to delete this session?
                    </DialogTitle>
                    <DialogDescription>
                      All information related to this session including all
                      question will be removed
                    </DialogDescription>
                  </DialogHeader>
                  {/* <CardSession data={} /> */}
                  <DialogFooter>
                    <Button variant={"secondary"}>Back</Button>
                    <Button variant={"destructive"}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
          <CardContent className="pt-0 overflow-auto">
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
                        isRefetching={isRefetchingQuestions}
                        order={(data.order || 0) + 1}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <EmptyQuestion
              referenceId={dataSession?.id}
              refetch={refetchQuestions}
              isRefetching={isRefetchingQuestions}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const SeparatorAdd = ({
  refetch,
  referenceId,
  isRefetching,
  order,
}: {
  refetch?: () => void;
  referenceId?: string;
  isRefetching?: boolean;
  order: number;
}) => {
  const { mutate: createQuestion, isPending: isPendingCreateQuestion } =
    trpc.organization.question.create.useMutation({
      onSuccess() {
        refetch?.();
      },
    });

  const isPending = isPendingCreateQuestion || isRefetching;

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
