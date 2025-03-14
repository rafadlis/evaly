"use client";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useState } from "react";
import { TestAttemptWithSection } from "@evaly/backend/types/test.attempt";
import { useMutation, useMutationState } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/components/shared/progress-bar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Navbar = ({ attempt }: { attempt: TestAttemptWithSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRedirecting, setIsRedirecting] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { mutate: submitAttempt, isPending: isSubmitting } = useMutation({
    mutationKey: ["submit-attempt"],
    mutationFn: async () => {
      const res = await $api.participant.test
        .attempt({ id: attempt.id })
        .submit.post();

      if (res.status !== 200) {
        throw new Error(res.error?.value.toString());
      }

      if (!res.data?.testId) {
        throw new Error("Something went wrong, please try again later");
      }

      setIsRedirecting(() => {
        router.push(`/s/${res.data.testId}`);
      });
      return res.data;
    },
  });

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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="mr-4"
              disabled={isSubmitting || isRedirecting || isStillUpdatingAnswer}
            >
              {isSubmitting
                ? "Submitting..."
                : isRedirecting
                ? "Redirecting..."
                : "Submit this section"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to submit this section?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
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
          </DialogContent>
        </Dialog>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  // src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>FA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
