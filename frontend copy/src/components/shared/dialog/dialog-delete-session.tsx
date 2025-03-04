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
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc.client";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DialogDeleteSession = ({
  className,
  disabled = false,
  dialogTrigger = (
    <Button
      disabled={disabled}
      size={"icon-xs"}
      variant={"outline"}
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Trash2Icon />
    </Button>
  ),
  sessionId,
  onSuccess,
  isLastSession = false,
}: {
  className?: string;
  disabled?: boolean;
  dialogTrigger?: React.ReactNode;
  sessionId: string;
  onSuccess: () => void;
  isLastSession?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteSession, isPending } =
    trpc.organization.session.delete.useMutation({
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
          <DialogTitle>Are you sure want to delete this session?</DialogTitle>
          <DialogDescription>
            All information related to this session including all question will
            be removed
          </DialogDescription>
        </DialogHeader>
        {isLastSession && (
          <span className="text-sm text-muted-foreground bg-secondary p-2 rounded-md">
            You can&apos;t delete the last session. Please add at least one
            session before deleting.
          </span>
        )}
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => setOpen(false)}>
            Back
          </Button>
          <Button
            variant={"destructive"}
            disabled={isPending || isLastSession}
            onClick={() => {
              deleteSession({
                sessionId,
              });
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSession;
