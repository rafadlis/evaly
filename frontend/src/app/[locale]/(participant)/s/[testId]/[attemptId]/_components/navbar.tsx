"use client";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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
  Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const Navbar = ({ attempt }: { attempt: TestAttemptWithSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-row items-center border-b border-dashed justify-between px-6 py-3 sticky top-0 bg-background transition-all duration-300 z-50",
        isScrolled ? "border-border" : "border-transparent"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Link href={`/s/${attempt.testId}`}>
          <Button variant={"ghost"} size={"icon"}>
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-lg font-medium">
          {attempt.testSection?.title ||
            `Section ${attempt.testSection?.order}`}
        </h1>
      </div>
      <div className="flex flex-row items-center gap-2">
        <DialogSubmitAttempt attemptId={attempt.id} />
        <ThemeToggle />
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
        if (dataUpdatedAttempt) {
          return;
        }
        setIsOpen(open);
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
                <Button variant="outline" onClick={()=>{setIsOpen(false)}}>Close</Button>
            </DialogFooter>
          </DialogHeader>
        ) : !dataUpdatedAttempt ? (
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to submit this section?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setIsOpen(false)}>Cancel</Button>
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
              <Button
                variant="outline"
                onClick={() => onGoToLobby(dataUpdatedAttempt)}
              >
                Go to lobby
              </Button>
            </DialogFooter>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Navbar;
