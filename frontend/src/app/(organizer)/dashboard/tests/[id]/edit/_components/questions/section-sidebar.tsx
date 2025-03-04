import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusIcon } from "lucide-react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import { useParams } from "next/navigation";
import { trpc } from "@/trpc/trpc.client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import CardSession from "@/components/shared/card/card-session";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Reorder } from "motion/react";

const SectionSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-[240px]  h-max pb-20 sticky top-20", className)}>
      <ListSession />
      <AddSession />
    </div>
  );
};

const ListSession = () => {
  const { id } = useParams();
  const [selectedSession, setSelectedSession] = useSelectedSession();

  const { data, isPending, isRefetching, refetch } =
    trpc.organization.session.sessionByTestId.useQuery({
      testId: id as string,
    });

  const { refetch: refetchSessionById } =
    trpc.organization.session.byId.useQuery(
      {
        id: selectedSession as string,
      },
      {
        enabled: !!selectedSession,
      }
    );

  const [orderedData, setOrderedData] = useState<typeof data>([]);

  useEffect(() => {
    if (data) {
      setOrderedData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data?.length && !selectedSession) {
      setSelectedSession(data[0].id);
    }
  }, [data, selectedSession, setSelectedSession]);

  const { mutateAsync: updateOrder, isPending: isPendingUpdateOrder } =
    trpc.organization.session.updateOrder.useMutation();

  const onChangeOrder = async () => {
    const sessionIds = orderedData?.map((e) => e.id) || [];
    await updateOrder({ sessionIds });
    await refetch();
    await refetchSessionById();
  };

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-20 rounded-lg" />
        <Skeleton className="w-full h-20 rounded-lg" />
        <Skeleton className="w-full h-20 rounded-lg" />
        <Skeleton className="w-full h-20 rounded-lg" />
      </div>
    );
  }

  if (!data || !data.length || !orderedData) {
    return <div>No session found</div>;
  }

  return (
    <ScrollArea>
      <Reorder.Group
        className={cn(
          "flex flex-col gap-2 max-h-[60vh]",
          isRefetching || isPendingUpdateOrder ? "animate-pulse opacity-80" : ""
        )}
        axis="y"
        values={orderedData}
        onReorder={setOrderedData}
      >
        {orderedData?.map((e) => (
          <Reorder.Item
            key={e.id}
            value={e}
            onDragEnd={onChangeOrder}
            dragListener={isPendingUpdateOrder ? false : true}
          >
            <CardSession
              data={e}
              key={e.id}
              isSelected={e.id === selectedSession}
              onClick={() => setSelectedSession(e.id)}
              onDeleteSuccess={async () => {
                await refetch();
                if (e.id === selectedSession) {
                  const nearestSession = data.find(
                    (session) => session.id !== e.id
                  );
                  if (nearestSession) {
                    setSelectedSession(nearestSession.id);
                  }
                }
              }}
              isLastSession={data.length === 1}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <ScrollBar />
    </ScrollArea>
  );
};

const AddSession = () => {
  const { id } = useParams();
  const [, setSelectedSession] = useSelectedSession();

  const {
    refetch,
    isPending: isPendingSession,
    isRefetching: isRefetchingSession,
  } = trpc.organization.session.sessionByTestId.useQuery({
    testId: id as string,
  });

  const { mutate, isPending } = trpc.organization.session.create.useMutation({
    onSuccess(data) {
      const sessionId = data.at(0)?.id;
      if (sessionId) {
        setSelectedSession(sessionId);
        refetch();
      }
    },
  });

  if (isPendingSession) return null;

  return (
    <div className="flex flex-col items-start mt-4">
      <Button
        variant={"outline"}
        className="w-max"
        disabled={isPending || isRefetchingSession}
        onClick={() => {
          mutate({ testId: id as string });
        }}
      >
        {isPending || isRefetchingSession ? (
          <Loader2 className="animate-spin" />
        ) : (
          <PlusIcon />
        )}{" "}
        Add Session
      </Button>
    </div>
  );
};

export default SectionSidebar;
