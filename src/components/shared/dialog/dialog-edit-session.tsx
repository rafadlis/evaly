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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateTestSession } from "@/lib/db/schema";
import { trpc } from "@/trpc/trpc.client";
import { Loader2, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DialogEditSessionDuration from "./dialog-edit-session-duration";

const DialogEditSession = ({ sessionId }: { sessionId: string }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdateTestSession>();

  const {
    data: dataSession,
    refetch: refetchSession,
    isRefetching: isRefetchingSession,
  } = trpc.organization.session.byId.useQuery({
    id: sessionId,
  });

  const { refetch: refetchSessions } =
    trpc.organization.session.sessionByTestId.useQuery(
      {
        testId: dataSession?.testId as string,
      },
      {
        enabled: !!dataSession?.testId,
      }
    );

  useEffect(() => {
    if (dataSession) {
      reset(dataSession);
    }
  }, [dataSession, reset]);

  const { mutate: updateSession, isPending: isPendingUpdateSession } =
    trpc.organization.session.update.useMutation({
      onSuccess: async () => {
        await refetchSession();
        refetchSessions();
        setOpen(false);
      },
    });

  const onSubmit = (data: UpdateTestSession) => {
    updateSession({
      sessionId,
      data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon-xs"} variant={"ghost"} rounded={false}>
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit session detail</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 mt-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              placeholder="Type session's title here..."
              {...register("title")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Duration</Label>
            <DialogEditSessionDuration
              sessionId={sessionId}
              className="w-max"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Type session's description here..."
              {...register("description")}
            />
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
            <Button
              disabled={
                isPendingUpdateSession || !isDirty || isRefetchingSession
              }
              type="submit"
            >
              {isPendingUpdateSession || isRefetchingSession ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save & exit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditSession;
