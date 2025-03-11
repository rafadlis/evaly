import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

const DialogDeleteTest = ({
  className,
  testId,
  onSuccess,
}: {
  className?: string;
  testId: string;
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-test"],
    mutationFn: async (testId: string) => {
      const response = await $api.organization.test({ id: testId }).delete();

      if (response.status !== 200) {
        throw new Error("Failed to delete test");
      }

      setOpen(false);
      onSuccess?.();
      return response.data;
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon-xs"}
          variant={"ghost"}
          className={cn(className)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Are you sure want to delete this session?</DialogTitle>
          <DialogDescription>
            All information related to this session including all question will
            be removed
          </DialogDescription>
        </DialogHeader>
        {/* <CardSession data={} /> */}
        <DialogFooter>
          <Button variant={"secondary"}>Back</Button>
          <Button variant={"destructive"} onClick={() => mutate(testId)}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteTest;
