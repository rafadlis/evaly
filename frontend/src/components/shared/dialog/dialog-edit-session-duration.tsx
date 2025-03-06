import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useSessionByIdQuery } from "@/query/organization/session/use-session-by-id";
import { useSessionByTestIdQuery } from "@/query/organization/session/use-session-by-test-id";
import { UpdateTestSession } from "@evaly/backend/types/test";
import { useMutation } from "@tanstack/react-query";
import { ClockIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DialogEditSessionDuration = ({
  className,
  disabled = false,
  onSuccess,
  sessionId,
}: {
  className?: string;
  disabled?: boolean;
  sessionId?: string; // Made optional since it's not used in the component
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
 
  const {
    data: dataSession,
    isRefetching: isRefetchingSession,
    refetch: refetchSession,
  } = useSessionByIdQuery({id: sessionId as string})

  const { refetch: refetchSessions } = useSessionByTestIdQuery({testId: dataSession?.testId as string})

  const { mutate: updateSession, isPending: isPendingUpdateSession } =
    useMutation({
      mutationKey: ["update-session"],
      mutationFn: async (data: UpdateTestSession) => {
        const response = await $api.organization.test
          .session({ id: sessionId as string })
          .put(data);
        if (response.status !== 200) {
          throw new Error(response.error?.value as unknown as string);
        }
        return response.data;
      },
      onSuccess: async () => {
        await refetchSession();
        await refetchSessions();
        onSuccess?.();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // States for the form inputs - initialize directly from value prop
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    let hours = 0;
    let minutes = 0;

    if (dataSession) {
      hours = Math.floor((dataSession.duration || 0) / 60);
      minutes = (dataSession.duration || 0) % 60;
    }

    setHours(hours);
    setMinutes(minutes);
  }, [dataSession]);

  const handleSave = async () => {
    const newTotalMinutes = hours * 60 + minutes;

    updateSession({
      duration: newTotalMinutes,
    });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          // set the value to the original value
          setHours(Math.floor((dataSession?.duration || 0) / 60));
          setMinutes((dataSession?.duration || 0) % 60);
        }
        setOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          size={"xs"}
          variant={"outline"}
          className={cn(className)}
          onClick={(e) => e.stopPropagation()}
        >
          <ClockIcon /> {hours > 0 ? `${hours}h ` : ""}
          {minutes}m
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <form className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hours</Label>
            <Input
              type="number"
              className="w-20"
              value={hours}
              min={0}
              max={23}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Minutes</Label>
            <Input
              type="number"
              className="w-20"
              value={minutes}
              min={0}
              max={59}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </div>
          <Button
            disabled={isPendingUpdateSession || isRefetchingSession}
            onClick={handleSave}
            type="button"
            className="w-full col-span-2"
          >
            {isPendingUpdateSession ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DialogEditSessionDuration;
