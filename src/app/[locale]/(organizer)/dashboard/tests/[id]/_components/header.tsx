"use client";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  LinkIcon,
  Loader2,
  RotateCcw,
  Save,
  TimerOff,
} from "lucide-react";
import { useParams } from "next/navigation";
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
import { useEffect, useState, useTransition } from "react";
import { trpc } from "@/trpc/trpc.client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { UpdateTest } from "@/types/test";
import DialogPublishTest from "@/components/shared/dialog/dialog-publish-test";
import { useTabsState } from "../_hooks/use-tabs-state";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

const Header = () => {
  const [, setTabs] = useTabsState("settings");
  const { id } = useParams();
  const router = useRouter();
  const [isRedirect, setIsRedirect] = useTransition();
  const tCommon = useTranslations("Common");
  const tOrganizer = useTranslations("Organizer");
  const [participantOnline, setParticipantOnline] = useState<string[]>([]);

  const {
    register,
    reset,
    formState: { isDirty },
    getValues,
    watch,
  } = useForm<UpdateTest>();

  const { isPublished } = watch();

  const {
    data: dataTest,
    isPending: isPendingTest,
    isRefetching: isRefetchingTest,
    refetch: refetchTest,
  } = trpc.organization.test.getById.useQuery({ id: id?.toString() || "" });

  useEffect(() => {
    if (dataTest) {
      reset(dataTest);
    }
  }, [dataTest, reset]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase.channel(id?.toString() || "");

    channel
      .on("presence", { event: "sync" }, () => {
        const users = Object.keys(channel.presenceState());
        setParticipantOnline([...new Set(users)]);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("Join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("Leave", key, leftPresences);
      });
    channel.subscribe(() => {});

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

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
          router.push(`/dashboard/tests/${data.id}`);
        });
      },
      onError(error) {
        toast.error(error.message || tCommon("genericUpdateError"));
      },
    });

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

  return (
    <>
      <BackButton className="mb-2" href={`/dashboard/tests`} />
      <div className="flex flex-row justify-between items-start">
        {isPendingTest ? (
          <h1 className="animate-pulse text-muted-foreground text-xl font-medium">
            Loading...
          </h1>
        ) : (
          <div className="flex flex-col">
            <input
              type="text"
              {...register("title")}
              className="outline-none text-xl font-medium"
              placeholder={isPendingTest ? "Loading..." : "Test title"}
              disabled={isPendingTest || isUpdatingTest}
            />

            {isDirty && isPendingTest === false ? (
              <div className="w-max mt-2">
                <Button
                  variant={"default"}
                  disabled={isUpdatingTest}
                  className="w-max"
                  size={"sm"}
                  onClick={() =>
                    mutateUpdateTest({
                      id: id?.toString() || "",
                      title: getValues("title"),
                    })
                  }
                >
                  {isUpdatingTest ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  {tCommon("saveButton")}
                </Button>
              </div>
            ) : null}
          </div>
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
            {isPublished ? (
              <EndTestButton
                refetchTest={refetchTest}
                id={id?.toString() || ""}
              />
            ) : null}
            {!isPublished ? (
              <DialogPublishTest
                testId={id?.toString() || ""}
                onPublished={(newTest) => {
                  reset(newTest);
                  setTabs("submissions");
                }}
              />
            ) : null}
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

      <div className="mb-6 mt-2 flex flex-row items-center">
        <TabsList>
          {/* <TabsTrigger value="summary">Summary</TabsTrigger> */}
          {isPublished ? (
            <TabsTrigger value="submissions">
              {tOrganizer("submissionsTab")}
            </TabsTrigger>
          ) : null}
          {isPublished ? (
            <TabsTrigger value="share">{tOrganizer("shareTab")}</TabsTrigger>
          ) : null}
          <TabsTrigger value="questions">
            {tOrganizer("questionsTab")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {tOrganizer("settingsTab")}
          </TabsTrigger>
        </TabsList>
        {isPublished ? (
          <div className="flex flex-row items-center gap-2 ml-4 text-sm">
            <div
              className={cn(
                "size-2.5 bg-emerald-500 rounded-full transition-all",
                participantOnline.length === 0 ? "bg-foreground/15" : ""
              )}
            />
            <NumberFlow value={participantOnline.length} suffix=" Online" />
          </div>
        ) : null}
      </div>
    </>
  );
};

const EndTestButton = ({
  refetchTest,
  id,
}: {
  refetchTest: () => void;
  id: string;
}) => {
  const { mutate: mutateUpdateTest, isPending: isUpdatingTest } =
    trpc.organization.test.update.useMutation({
      onSuccess() {
        toast.success("Test finished successfully");
        refetchTest();
      },
    });

  const finishTest = () => {
    mutateUpdateTest({
      id,
      finishedAt: new Date().toISOString(),
    });
  };

  return (
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
          <DialogTitle>Are you sure you want to end the test?</DialogTitle>
          <DialogDescription>
            The test will be closed and no more submissions will be allowed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-row gap-2 justify-between w-full">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <div className="flex flex-row gap-2">
              <Button
                variant={"default"}
                onClick={finishTest}
                disabled={isUpdatingTest}
              >
                {isUpdatingTest ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>End now</>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Header;
