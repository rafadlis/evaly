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
import { Trash2Icon } from "lucide-react";

const DialogDeleteSession = ({
  className,
  dialogTrigger = (
    <Button size={"icon-xs"} variant={"outline"} className={cn(className)}>
      <Trash2Icon />
    </Button>
  ),
}: {
  className?: string;
  dialogTrigger?: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
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
          <Button variant={"destructive"}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSession;
