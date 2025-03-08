"use client";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerNavbar,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { useTestValidatePublishable } from "@/query/organization/test/use-test-validate-publishable";
import {
    CheckIcon,
    Rocket,
    RocketIcon,
    TriangleAlert,
    XIcon,
} from "lucide-react";
import { useState } from "react";

const DialogPublishTest = ({ testId }: { testId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useTestValidatePublishable(testId);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Rocket /> Publish
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => {
            setIsOpen(false);
          }}
          title="Publish Test"
        />
        <div className=" overflow-y-auto">
          <div className="flex-1 container max-w-2xl py-10">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-bold">
                Check your test before publishing
              </h1>
              <Button
                className="w-max mt-4 font-semibold text-base h-12"
                disabled={!data?.isPublishable}
                size={"lg"}
              >
                <RocketIcon /> Publish
              </Button>
            </div>
            <div className="flex flex-col mt-6 border px-4 py-2 divide-y">
              {data?.checklist.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-row items-center gap-6 py-1"
                >
                  {e.status === "ok" ? (
                    <div className="flex items-center justify-around bg-success text-success-foreground p-2">
                      <CheckIcon className="size-4 " />
                    </div>
                  ) : e.status === "error" ? (
                    <div className="flex items-center justify-around bg-destructive/10 text-destructive p-2">
                      <XIcon className="size-4 " />
                    </div>
                  ) : (
                    <TriangleAlert className="stroke-warning-foreground" />
                  )}
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">
                      {e.title}
                    </span>
                    <p>{e.message}</p>
                  </div>
                </div>
              ))}
            </div>
            {data?.isPublishable ? (
              <p className="text-sm text-muted-foreground mt-2">
                Your test is ready to be published.
              </p>
            ) : (
              <p className="text-sm text-destructive">
                Your test is not ready to be published. Please fix the issues
                above.
              </p>
            )}
            <h1 className="text-xl font-bold mt-12 mb-4">Summary</h1>
            <div className="flex flex-col gap-4 border px-4 py-2">
              <div>
                <Label>Title</Label>
                <p>{data?.summary?.title || "No title"}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p>
                  {data?.summary?.type === "self-paced"
                    ? "Self-Paced"
                    : "Live Test"}
                </p>
              </div>
              <div>
                <Label>Access</Label>
                <p>
                  {data?.summary?.access === "public"
                    ? "Public"
                    : "Invite Only"}
                </p>
              </div>
              <div>
                <Label>Total Sessions</Label>
                <p>{data?.summary?.totalSessions || "No total sessions"}</p>
              </div>
              <div>
                <Label>Total Questions</Label>
                <p>{data?.summary?.totalQuestions || "No total questions"}</p>
              </div>
              <div>
                <Label>Total Duration</Label>
                <p>{data?.summary?.totalDuration || "No total duration"}</p>
              </div>
              <div>
                <Label>Total Participants</Label>
                <p>
                  {data?.summary?.totalParticipants || "No total participants"}
                </p>
              </div>
              <div className="mt-6">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DialogPublishTest;
