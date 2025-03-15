"use client";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LinkIcon,
  Loader2,
  LockIcon,
  PencilLineIcon,
  RotateCcw,
  TimerOff,
} from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import { Link } from "@/components/shared/progress-bar";
import { toast } from "sonner";
import { env } from "@/lib/env";
import BackButton from "@/components/shared/back-button";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

const Header = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isRedirect, setIsRedirect] = useTransition();

  const {
    data: dataTest,
    isPending: isPendingTest,
    isRefetching: isRefetchingTest,
    refetch: refetchTest,
  } = useTestByIdQuery({
    id: id?.toString() || "",
  });

  const { mutate: mutateUpdateTest, isPending: isUpdatingTest } = useMutation({
    mutationFn: async () => {
      const res = await $api.organization
        .test({ id: id?.toString() || "" })
        .put({
          finishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      if (res.error?.value) {
        return toast.error(res.error.value.toString());
      }

      await refetchTest();
      toast.success("Test finished successfully");
    },
  });

  const { mutate: mutateReopenTest, isPending: isReopeningTest } = useMutation({
    mutationKey: ["reopen-test"],
    mutationFn: async () => {
      const res = await $api.organization
        .test({ id: id?.toString() || "" })
        .reopen.put();

      if (res.error?.value) {
        return toast.error(res.error.value.toString());
      }
      if (!res.data?.id) {
        return toast.error("Failed to re-open test, please try again.");
      }

      setIsRedirect(() => {
        router.push(`/dashboard/tests/${res.data?.id}/edit`);
      });
    },
  });

  const finishTest = () => {
    mutateUpdateTest();
  };

  const reopenTest = () => {
    mutateReopenTest();
  };

  const copyLinkToShare = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_URL}/s/${dataTest?.id}`);
    toast.success("Link copied to clipboard", { position: "top-right" });
  };

  if (!isPendingTest && !dataTest) {
    return null
  }

  if (!dataTest?.isPublished && !isPendingTest && !isRefetchingTest) {
    return redirect(`/dashboard/tests/${id}/edit`);
  }

  return (
    <>
      <BackButton className="mb-2" href={`/dashboard/tests`} />
      <div className="flex flex-row items-center justify-between">
        {isPendingTest ? (
          <h1 className="animate-pulse text-muted-foreground text-3xl font-medium">
            Loading...
          </h1>
        ) : (
          <h1 className="text-3xl font-medium">{dataTest?.title}</h1>
        )}
        {isPendingTest ? (
          <Button variant={"ghost"}>
            <Loader2 className="animate-spin" />
            Loading...
          </Button>
        ) : !dataTest?.finishedAt ? (
          <div className="flex flex-row items-center gap-2">
            <Button variant={"ghost"} size={"icon"} onClick={copyLinkToShare}>
              <LinkIcon />
            </Button>
            <Link href={`/dashboard/tests/${id}/edit`}>
              <Button variant={"outline"}>
                <PencilLineIcon /> Edit
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"default"} disabled={isUpdatingTest}>
                  {isUpdatingTest ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <TimerOff className="mr-1" />
                  )}
                  End Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to end the test?
                  </DialogTitle>
                  <DialogDescription>
                    The test will be closed and no more submissions will be
                    allowed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button
                    variant={"destructive"}
                    onClick={finishTest}
                    disabled={isUpdatingTest || isRedirect}
                  >
                    {isUpdatingTest || isRedirect ? (
                      <Loader2 className="animate-spin" />
                    ) : "Yes, end test"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2">
            <Button variant={"ghost"}>
              <LockIcon />
              Finished
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline-solid"}>
                  <RotateCcw />
                  Re-open test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>You are about to re-open the test.</DialogTitle>
                  <DialogDescription>
                    This action will re-create a completely new test with the
                    same questions and settings, just like duplicating the test.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button
                    variant={"default"}
                    onClick={reopenTest}
                    disabled={isReopeningTest || isRedirect}
                  >
                    {isReopeningTest || isRedirect ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <RotateCcw />
                    )}
                    Re-open test
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="mb-6 mt-4 flex flex-row justify-between items-center">
        <TabsList>
          {/* <TabsTrigger value="summary">Summary</TabsTrigger> */}
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </div>
    </>
  );
};

export default Header;
