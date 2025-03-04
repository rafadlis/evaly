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

const DialogDeleteQuestion = ({
  className,
  disabled = false,
  dialogTrigger = (
    <Button
      disabled={disabled}
      size={"icon-xxs"}
      variant={"ghost"}
      rounded={false}
      className={cn("text-muted-foreground", className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Trash2Icon />
    </Button>
  ),
  questionId,
  onSuccess,
}: {
  className?: string;
  disabled?: boolean;
  dialogTrigger?: React.ReactNode;
  questionId: string;
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteQuestion, isPending } =
    trpc.organization.question.delete.useMutation({
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
          <DialogTitle>Are you sure want to delete this question?</DialogTitle>
          <DialogDescription>
            All information related to this question will be removed
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            Back
          </Button>
          <Button
            variant={"destructive"}
            disabled={isPending}
            onClick={(e) => {
              e.stopPropagation();
              deleteQuestion({
                questionId,
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

export default DialogDeleteQuestion;
