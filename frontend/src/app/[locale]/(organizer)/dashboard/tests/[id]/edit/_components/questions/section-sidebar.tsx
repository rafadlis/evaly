import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusIcon } from "lucide-react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import CardSection from "@/components/shared/card/card-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Reorder } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useTestSectionByTestIdQuery } from "@/query/organization/test-section/use-test-section-by-test-id";
import { useTestSectionByIdQuery } from "@/query/organization/test-section/use-test-section-by-id";

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
  const [selectedSection, setSelectedSection] = useSelectedSection();

  const { data, isPending, isRefetching, refetch } = useTestSectionByTestIdQuery({
    testId: id as string,
  });

  const { refetch: refetchSectionById } = useTestSectionByIdQuery({
    id: selectedSection as string,
  });

  const [orderedData, setOrderedData] = useState<typeof data>([]);

  useEffect(() => {
    if (data) {
      setOrderedData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data?.length && !selectedSection) {
      setSelectedSection(data[0].id);
    }
  }, [data, selectedSection, setSelectedSection]);

  const { mutateAsync: updateOrder, isPending: isPendingUpdateOrder } =
    useMutation({
      mutationKey: ["update-section-order"],
      mutationFn: async (sectionIds: string[]) => {
        const response = await $api.organization.test.section.order.put({
          testId: id as string,
          order: sectionIds,
        });
        return response.data;
      },
    });

  const onChangeOrder = async () => {
    const sectionIds = orderedData?.map((e) => e.id) || [];
    await updateOrder(sectionIds);
    await refetch();
    await refetchSectionById();
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
            <CardSection
              data={e}
              key={e.id}
              isSelected={e.id === selectedSection}
              onClick={() => setSelectedSection(e.id)}
              onDeleteSuccess={async () => {
                await refetch();
                if (e.id === selectedSection) {
                  const nearestSection = data.find(
                    (section) => section.id !== e.id
                  );
                  if (nearestSection) {
                    setSelectedSection(nearestSection.id);
                  }
                }
              }}
              isLastSection={data.length === 1}
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
  const [, setSelectedSection] = useSelectedSection();

  const {
    refetch,
    isPending: isPendingSession,
    isRefetching: isRefetchingSection,
  } = useTestSectionByTestIdQuery({ testId: id as string });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-section"],
    mutationFn: async () => {
      const response = await $api.organization.test.section.create.post({
        testId: id as string,
      });
      return response.data?.sections;
    },
    onSuccess(data) {
      const sectionId = data?.at(0)?.id;
      if (sectionId) {  
        setSelectedSection(sectionId);
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
        disabled={isPending || isRefetchingSection}
        onClick={() => {
          mutate();
        }}
      >
        {isPending || isRefetchingSection ? (
          <Loader2 className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Add Section
      </Button>
    </div>
  );
};

export default SectionSidebar;
