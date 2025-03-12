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
import { toast } from "sonner";

const DialogDeleteSection = ({
  className,
  disabled = false,
  dialogTrigger = (
    <Button
      disabled={disabled}
      size={"icon-xs"}
      variant={"ghost"}
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Trash2Icon />
    </Button>
  ),
  sectionId,
  onSuccess,
  isLastSection = false,
}: {
  className?: string;
  disabled?: boolean;
  dialogTrigger?: React.ReactNode;
  sectionId: string;
  onSuccess: () => void;
  isLastSection?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteSection, isPending } = useMutation({
    mutationKey: ["delete-section"],
    mutationFn: async () => {
      const response = await $api.organization.test
        .section({ id: sectionId })
        .delete.delete();

      if (response.status !== 200) {
        throw new Error(response.error?.value as unknown as string);
      }
      return response.data;
    },
    onSuccess: () => {
      onSuccess();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure want to delete this section?</DialogTitle>
          <DialogDescription>
            All information related to this section including all question will
            be removed
          </DialogDescription>
        </DialogHeader>
        {isLastSection && (
          <span className="text-sm text-muted-foreground bg-secondary p-2 rounded-md">
            You can&apos;t delete the last section. Please add at least one
            section before deleting.
          </span>
        )}
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => setOpen(false)}>
            Back
          </Button>
          <Button
            variant={"destructive"}
            disabled={isPending || isLastSection}
            onClick={() => deleteSection()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSection;
