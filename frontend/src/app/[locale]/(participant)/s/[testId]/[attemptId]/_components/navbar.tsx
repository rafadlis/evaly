"use client";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  TestAttempt,
  TestAttemptWithSection,
} from "@evaly/backend/types/test.attempt";
import { useMutation, useMutationState } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { CheckIcon, ChevronLeft } from "lucide-react";
import { Link } from "@/components/shared/progress-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = ({ attempt }: { attempt: TestAttemptWithSection }) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between px-4 h-14 bg-background"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/s/${attempt.testId}`}>
              <Button variant={"ghost"} size={"icon"}>
                <ChevronLeft />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Are you sure want to go back?</TooltipContent>
        </Tooltip>

        <h1 className="font-medium">
          {attempt.testSection?.title ||
            `Section ${attempt.testSection?.order}`}
        </h1>
      </div>
      <div className="flex flex-row items-center gap-2">
        <ThemeToggle />
        <DialogSubmitAttempt attemptId={attempt.id} />
      </div>
    </div>
  );
};

const DialogSubmitAttempt = ({ attemptId }: { attemptId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // detect if user still updating the answer from card-question
  const listUpdatingAnswer = useMutationState({
    filters: {
      predicate: (mutation) => {
        return (
          mutation.state.status === "pending" &&
          mutation.options.mutationKey?.[0] === "post-answer"
        );
      },
    },
  });

  const isStillUpdatingAnswer = listUpdatingAnswer.length > 0;

  const [isRedirecting, setIsRedirecting] = useTransition();
  const router = useRouter();

  const {
    isPending: isSubmitting,
    data: dataUpdatedAttempt,
    mutate: submitAttempt,
    isError,
    error,
    reset: resetMutation,
  } = useMutation({
    mutationKey: ["submit-attempt"],
    mutationFn: async () => {
      const res = await $api.participant.test
        .attempt({ id: attemptId })
        .submit.post();

      if (res.status !== 200) {
        throw new Error(res.error?.value.toString());
      }

      const data = res.data;

      if (!data) {
        throw new Error("Something went wrong, please try again later");
      }

      return res.data;
    },
  });

  const onGoToLobby = (data: TestAttempt) => {
    setIsRedirecting(() => {
      router.push(`/s/${data.testId}`);
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When closing, we reset the dialog state
          setIsOpen(false);
          // Reset the mutation state when dialog closes
          resetMutation();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="mr-4"
          disabled={isStillUpdatingAnswer}
        >
          Submit this section
        </Button>
      </DialogTrigger>
      <DialogContent>
        {isError ? (
          <DialogHeader>
            <DialogTitle>Oops, something went wrong!</DialogTitle>
            <DialogDescription>{(error as Error).message}</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        ) : !dataUpdatedAttempt ? (
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to submit this section?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="default"
                onClick={() => submitAttempt()}
                disabled={isSubmitting || isRedirecting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isRedirecting
                    ? "Redirecting..."
                    : "Yes, submit"}
              </Button>
            </DialogFooter>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center gap-2">
              <CheckIcon className="size-6 text-green-500" />
              You have successfully submitted this section
            </DialogTitle>
            <DialogDescription>
              {dataUpdatedAttempt.nextSection
                ? "You can now go to the next section or go to the lobby to see the result of this section."
                : "You can now go to the lobby to see the result."}
            </DialogDescription>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => dataUpdatedAttempt && onGoToLobby(dataUpdatedAttempt)}
                >
                  Go to lobby
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Navbar;
