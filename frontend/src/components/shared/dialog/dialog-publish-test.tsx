"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerNavbar,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { $api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTestValidatePublishable } from "@/query/organization/test/use-test-validate-publishable";
import { Test } from "@evaly/backend/types/test";
import { useMutation } from "@tanstack/react-query";
import {
  CheckIcon,
  CircleAlert,
  Loader2, LockIcon, TriangleAlert,
  XIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DialogPublishTest = ({
  testId,
  onPublished,
}: {
  testId: string;
  onPublished?: (newTest: Test) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = useTestValidatePublishable(testId, isOpen);
  const { mutate: publishTest, isPending: isPublishing } = useMutation({
    mutationKey: ["publish-test"],
    mutationFn: async () => {
      const res = await $api.organization.test({ id: testId }).publish.put();
      if (res.error?.value) {
        return toast.error(res.error.value.toString());
      }

      if (res.data?.data) {
        onPublished?.(res.data?.data);
      }

      toast.success("Test published successfully");
      setIsOpen(false);
      return res.data;
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button disabled={isPublishing}>
          Publish
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => {
            setIsOpen(false);
          }}
          title="Publish Test"
        />
        <div className="overflow-y-auto">
          {isPending ? (
              <Loader2 className="animate-spin mx-auto size-10 mt-10" />
          ) : (
            <div className="flex-1 container max-w-3xl py-10">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-medium">
                Review Test Before Publishing
              </h1>
              <Button
                className="w-max mt-4"
                disabled={
                  !data?.isPublishable || !data.isPublishable || isPublishing
                }
                onClick={() => {
                  publishTest();
                }}
              >
                {!data?.isPublishable ? <LockIcon /> :null}
                {isPublishing ? (
                  <Loader2 className="animate-spin" />
                ) : "Publish Test"}
                
              </Button>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              {data?.checklist.map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    "flex flex-row items-start gap-3",
                  )}
                >
                  {e.status === "ok" ? (
                    <CheckIcon className="size-4 text-success-foreground" />
                  ) : e.status === "error" ? (
                    <XIcon className="size-4 text-destructive" />
                  ) : (
                    <TriangleAlert className="stroke-warning-foreground size-4" />
                  )}
                  <div className="flex-1 leading-0 -mt-1">
                    <span className="text-sm text-muted-foreground">
                      {e.title}
                    </span>
                    <p className="text-sm">{e.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm">
              {data?.isPublishable ? (
                <p className="text-success-foreground bg-success px-4 py-2">
                  Your test is ready to be published.
                </p>
              ) : (
                <span className="bg-destructive/10 text-destructive px-4 py-2 flex items-center gap-2 border border-destructive/10">
                  <CircleAlert size={16}/>
                  Your test is not ready to be published. Please fix the issues
                  above.
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold mt-12 mb-4">Summary</h1>
            <div className="grid grid-cols-4 divide-x divide-y border text-sm">
              <div className="p-4 col-span-2">
                <Label>Title</Label>
                <p>{data?.summary?.title || "No title"}</p>
              </div>
              <div className="p-4">
                <Label>Type</Label>
                <p>
                  {data?.summary?.type === "self-paced"
                    ? "Self-Paced"
                    : "Live Test"}
                </p>
              </div>
              <div className="p-4">
                <Label>Access</Label>
                <p>
                  {data?.summary?.access === "public"
                    ? "Public"
                    : "Invite Only"}
                </p>
              </div>
              <div className="p-4">
                <Label>Total Sections</Label>
                <p>{data?.summary?.totalSections || "No total sections"}</p>
              </div>
              <div className="p-4">
                <Label>Total Questions</Label>
                <p>{data?.summary?.totalQuestions || "No total questions"}</p>
              </div>
              <div className=" p-4">
                <Label>Total Duration</Label>
                <p>{data?.summary?.totalDuration || "No total duration"}</p>
              </div>
              <div className=" p-4">
                <Label>Total Participants</Label>
                <p>
                  {data?.summary?.totalParticipants || "No total participants"}
                </p>
              </div>
              <div className="col-span-4 max-h-[300px] overflow-y-auto  p-4">
                <Label>Description</Label>
                <div
                  className="custom-prose"
                  dangerouslySetInnerHTML={{
                    __html: data?.summary?.description || "No description",
                  }}
                />
              </div>
            </div>
          </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DialogPublishTest;
