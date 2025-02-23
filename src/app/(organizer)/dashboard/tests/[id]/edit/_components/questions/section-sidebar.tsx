import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusIcon } from "lucide-react";
import { useSelectedSession } from "../../_hooks/use-selected-session";
import { useParams } from "next/navigation";
import { trpc } from "@/trpc/trpc.client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import CardSession from "@/components/shared/card/card-session";

const SectionSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-[240px] sticky top-4 h-max pb-20", className)}>
      <ListSession />
      <AddSession />
    </div>
  );
};

const ListSession = () => {
  const { id } = useParams();
  const [selectedSession, setSelectedSession] = useSelectedSession();

  const { data, isPending, isRefetching } =
    trpc.organization.session.sessionByTestId.useQuery({
      testId: id as string,
    });

  useEffect(() => {
    if (data?.length && !selectedSession) {
      setSelectedSession(data[0].id);
    }
  }, [data, selectedSession, setSelectedSession]);

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

  if (!data || !data.length) {
    return <div>No session found</div>;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 max-h-[60vh] overflow-y-auto hide-scrollbar",
        isRefetching ? "animate-pulse opacity-80" : ""
      )}
    >
      {data?.map((e) => (
        <CardSession
          data={e}
          key={e.id}
          isSelected={e.id === selectedSession}
          onClick={() => setSelectedSession(e.id)}
        />
      ))}
    </div>
  );
};


const AddSession = () => {
  const { id } = useParams();
  const [, setSelectedSession] = useSelectedSession();

  const { refetch, isPending: isPendingSession } =
    trpc.organization.session.sessionByTestId.useQuery({
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
        disabled={isPending}
        onClick={() => {
          mutate({ testId: id as string });
        }}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <PlusIcon />} Add
        Session
      </Button>
    </div>
  );
};

export default SectionSidebar;
