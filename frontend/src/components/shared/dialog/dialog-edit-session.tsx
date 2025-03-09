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
import { CircleHelpIcon, Loader2, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateTestSession } from "@evaly/backend/types/test";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useSessionByIdQuery } from "@/query/organization/session/use-session-by-id";
import { useSessionByTestIdQuery } from "@/query/organization/session/use-session-by-test-id";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DialogEditSession = ({ sessionId }: { sessionId: string }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<UpdateTestSession>();

  const {
    data: dataSession,
    refetch: refetchSession,
    isRefetching: isRefetchingSession,
  } = useSessionByIdQuery({ id: sessionId });

  const { refetch: refetchSessions } = useSessionByTestIdQuery({
    testId: dataSession?.testId as string,
  });

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
        <Button size={"icon-xs"} variant={"ghost"}>
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
            <div className="flex flex-row gap-2 items-center">
              <Label>Duration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"} size={"icon-xs"}>
                    <CircleHelpIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  If you want participants to be able to finish the test whenever
                  they want, you can leave the duration empty.
                </PopoverContent>
              </Popover>
            </div>
            <Controller
              control={control}
              name="duration"
              render={({ field }) => {
                const hours = Math.floor((field.value || 0) / 60);
                const minutes = (field.value || 0) % 60 || 0;
                return (
                  <>
                    <div className="flex flex-row gap-4">
                      <div>
                        <Label>Hours</Label>
                        <Input
                          type="number"
                          className="w-20"
                          min={0}
                          max={23}
                          placeholder="0-23"
                          value={hours === 0 && !hours ? "" : hours}
                          onChange={(e) => {
                            if (Number(e.target.value) > 23) {
                              toast.error("Hours must be between 0 and 23");
                              return;
                            }
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value * 60 + minutes);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Minutes</Label>
                        <Input
                          type="number"
                          className="w-20"
                          value={minutes === 0 && !minutes ? "" : minutes}
                          min={0}
                          max={59}
                          placeholder="0-59"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            if (value > 59) {
                              toast.error("Minutes must be between 0 and 59");
                              return;
                            }
                            field.onChange(value + hours * 60);
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              }}
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
