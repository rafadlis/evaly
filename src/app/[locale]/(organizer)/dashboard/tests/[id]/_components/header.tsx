"use client";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, LinkIcon, Loader2, RotateCcw, TimerOff } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";
import { env } from "@/lib/env.client";
import BackButton from "@/components/shared/back-button";
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
import { trpc } from "@/trpc/trpc.client";
import { useTranslations } from "next-intl";

const Header = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isRedirect, setIsRedirect] = useTransition();
  const tCommon = useTranslations("Common");
  const tOrganizer = useTranslations("Organizer");

  const {
    data: dataTest,
    isPending: isPendingTest,
    isRefetching: isRefetchingTest,
    refetch: refetchTest,
  } = trpc.organization.test.getById.useQuery({ id: id?.toString() || "" });

  const { mutate: mutateUpdateTest, isPending: isUpdatingTest } =
    trpc.organization.test.update.useMutation({
      onSuccess() {
        toast.success("Test finished successfully");
        refetchTest();
      },
    });

  const { mutate: mutateReopenTest, isPending: isReopeningTest } =
    trpc.organization.test.duplicateTest.useMutation({
      onSuccess(data) {
        setIsRedirect(() => {
          router.push(`/dashboard/tests/${data.id}/edit`);
        });
      },
      onError(error) {
        toast.error(error.message || tCommon("genericUpdateError"));
      },
    });

  const finishTest = () => {
    mutateUpdateTest({ id: id?.toString() || "", finishedAt: new Date().toISOString(), });
  };

  const reopenTest = () => {
    mutateReopenTest({ id: id?.toString() || "" });
  };

  const copyLinkToShare = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_URL}/s/${dataTest?.id}`);
    toast.success("Link copied to clipboard", { position: "top-right" });
  };

  if (!isPendingTest && !dataTest) {
    return null;
  }

  if (!dataTest?.isPublished && !isPendingTest && !isRefetchingTest) {
    return redirect(`/dashboard/tests/${id}/edit`);
  }

  return (
    <>
      <BackButton className="mb-2" href={`/dashboard/tests`} />
      <div className="flex flex-row items-center justify-between">
        {isPendingTest ? (
          <h1 className="animate-pulse text-muted-foreground text-xl font-medium">
            Loading...
          </h1>
        ) : (
          <h1 className="text-xl font-medium">{dataTest?.title}</h1>
        )}
        {isPendingTest || isRefetchingTest ? (
          <Button variant={"ghost"}>
            <Loader2 className="animate-spin" />
            Loading...
          </Button>
        ) : !dataTest?.finishedAt ? (
          <div className="flex flex-row items-center gap-2">
            <Button variant={"ghost"} size={"icon"} onClick={copyLinkToShare}>
              <LinkIcon />
            </Button>
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
                  <div className="flex flex-row gap-2 justify-between w-full">
                    <DialogClose asChild>
                      <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <div className="flex flex-row gap-2">
                      {/* <Button
                        variant={"outline"}
                        onClick={finishTest}
                        disabled={isUpdatingTest || isRedirect}
                      >
                        {isUpdatingTest || isRedirect ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "End later"
                        )}
                      </Button> */}
                      <Button
                        variant={"destructive"}
                        onClick={finishTest}
                        disabled={isUpdatingTest || isRedirect}
                      >
                        {isUpdatingTest || isRedirect ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "End now"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2">
            <Button variant={"success"}>
              <Check />
              Finished
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"}>
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

      <div className="mb-6 mt-2 flex flex-row justify-between items-center">
        <TabsList>
          {/* <TabsTrigger value="summary">Summary</TabsTrigger> */}
          <TabsTrigger value="submissions">
            {tOrganizer("submissionsTab")}
          </TabsTrigger>
          <TabsTrigger value="share">{tOrganizer("shareTab")}</TabsTrigger>
          <TabsTrigger value="questions">
            {tOrganizer("questionsTab")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {tOrganizer("settingsTab")}
          </TabsTrigger>
        </TabsList>
      </div>
    </>
  );
};

export default Header;
