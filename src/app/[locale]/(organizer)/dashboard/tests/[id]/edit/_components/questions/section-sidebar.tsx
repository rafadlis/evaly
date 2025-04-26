import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2, PlusIcon, PointerIcon } from "lucide-react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import CardSection from "@/components/shared/card/card-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Reorder } from "motion/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionTemplateSection } from "./question-template-section";
import { toast } from "sonner";
import { trpc } from "@/trpc/trpc.client";
import { useTranslations } from "next-intl";

const SectionSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-[300px]  h-max pb-20 sticky top-20", className)}>
      <ListSession />
      <AddSession />
    </div>
  );
};

const ListSession = () => {
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useSelectedSection();

  const { data, isPending, isRefetching, refetch } =
    trpc.organization.testSection.getAll.useQuery({
      testId: id as string,
    });

  const { refetch: refetchSectionById } =
    trpc.organization.testSection.getById.useQuery({
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
    trpc.organization.testSection.updateOrder.useMutation();

  const onChangeOrder = async () => {
    const sectionIds = orderedData?.map((e) => e.id) || [];
    await updateOrder({ testId: id as string, order: sectionIds });
    await refetch();
    await refetchSectionById();
  };

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const tCommon = useTranslations("Common");
  const {
    refetch,
    isPending: isPendingSession,
    isRefetching: isRefetchingSection,
  } = trpc.organization.testSection.getAll.useQuery({ testId: id as string });

  const { mutateAsync, isPending } =
    trpc.organization.testSection.create.useMutation();

  const { mutateAsync: tranferQuestion, isPending: isPendingTransferQuestion } =
    trpc.organization.question.transferBetweenReference.useMutation({
      onError(error) {
        toast.error(error.message || tCommon("genericUpdateError"));
      },
    });

  async function onUseTemplate() {
    if (!selectedId) return;
    const createdSection = await mutateAsync({ testId: id as string });
    if (!createdSection?.sections?.length) {
      toast.error("Something went wrong!");
      return;
    }
    const order = 1;
    const toReferenceId = createdSection?.sections[0]?.id;
    const fromReferenceId = selectedId;

    const transferredQuestion = await tranferQuestion({
      order: Number(order),
      toReferenceId: toReferenceId as string,
      fromReferenceId,
    });

    if (transferredQuestion && transferredQuestion.length > 0) {
      const sectionId = createdSection?.sections[0]?.id;
      setIsOpen(false);
      if (sectionId) {
        setSelectedSection(sectionId);
        refetch();
      }
    }
  }

  if (isPendingSession) return null;

  return (
    <div className="flex flex-col items-end mt-2">
      <Dialog
        open={isOpen}
        onOpenChange={(e) => {
          if (!e) setSelectedId("");
          setIsOpen(e);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="w-max border-dashed"
            size={"sm"}
            disabled={isPending || isRefetchingSection}
          >
            {isPending || isRefetchingSection ? (
              <Loader2 className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
            Add Section
          </Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Add new section</DialogTitle>
            <DialogDescription className="flex flex-wrap">
              Add an empty section or use a question template. Click to
              selecting the template <PointerIcon className="size-4 ml-2" />
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[40vh]">
            <QuestionTemplateSection
              onSelectedIdChange={setSelectedId}
              selectedId={selectedId}
            />
          </ScrollArea>
          <DialogFooter>
            <div className="flex flex-row justify-between w-full">
              <DialogClose asChild>
                <Button variant={"secondary"}>Back</Button>
              </DialogClose>

              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  className="w-max"
                  disabled={isPending || isRefetchingSection}
                  onClick={async () => {
                    const data = await mutateAsync({ testId: id as string });
                    const sectionId = data?.sections[0]?.id;
                    setIsOpen(false);
                    if (sectionId) {
                      setSelectedSection(sectionId);
                      refetch();
                    }
                  }}
                >
                  {isPending || isRefetchingSection ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusIcon />
                  )}
                  Create Empty Section
                </Button>
                <Button
                  onClick={onUseTemplate}
                  variant={"default"}
                  disabled={
                    !selectedId || isPendingTransferQuestion || isPending
                  }
                >
                  {selectedId ? (
                    <>
                      Use template <ArrowRight />
                    </>
                  ) : (
                    "Choose template"
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionSidebar;
