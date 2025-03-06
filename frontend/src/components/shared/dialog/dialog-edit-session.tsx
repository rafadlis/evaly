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
import { Loader2, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DialogEditSessionDuration from "./dialog-edit-session-duration";
import { UpdateTestSession } from "@evaly/backend/types/test";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useSessionByIdQuery } from "@/query/organization/session/use-session-by-id";
import { useSessionByTestIdQuery } from "@/query/organization/session/use-session-by-test-id";

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
  } = useSessionByIdQuery({id: sessionId})

  const { refetch: refetchSessions } = useSessionByTestIdQuery({testId: dataSession?.testId as string})

  useEffect(() => {
    if (dataSession) {
      reset(dataSession);
    }
  }, [dataSession, reset]);

  const { mutate: updateSession, isPending: isPendingUpdateSession } =
    useMutation({
      mutationKey: ["update-session"],
      mutationFn: async (data: UpdateTestSession) => {
        const response = await $api.organization.test
          .session({ id: sessionId })
          .put(data);
        return response.data;
      },
      onSuccess: async () => {
        await refetchSession();
        refetchSessions();
        setOpen(false);
      },
    });

  const onSubmit = (data: UpdateTestSession) => {
    updateSession({
      ...data,
      duration: data.duration || 0, // Ensure duration is a number, not null or undefined
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
