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
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";

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

  return (
    <div
      className={cn(
        "flex flex-row items-center border-b border-dashed justify-between px-6 py-3 sticky top-0 bg-background transition-all duration-300 z-50",
        isScrolled ? "border-border" : "border-transparent"
      )}
    >
      <div className="text-lg font-medium">
        {attempt.testSection?.title || `Section ${attempt.testSection?.order}`}
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => submitAttempt()}
          disabled={isSubmitting || isRedirecting}
        >
          {isSubmitting ? "Submitting..." : isRedirecting ? "Redirecting..." : "Submit"}
        </Button>
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
