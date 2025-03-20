"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $api } from "@/lib/api";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import { useMutation } from "@tanstack/react-query";
import { UpdateTest } from "@evaly/backend/types/test";
import { CheckCircle2, Clock, LockIcon, Timer, ShieldOff } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import InviteOnly from "./invite-only";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SettingSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const SettingSection = ({
  title,
  description,
  children,
}: SettingSectionProps) => (
  <div className="py-4 first:pt-0 last:pb-0">
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-20">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Label className="text-sm text-muted-foreground">{description}</Label>
      </div>
      <div className="w-full flex flex-col gap-4">{children}</div>
    </div>
  </div>
);

const Setting = () => {
  const { id: testId } = useParams();
  const { isPending, data } = useTestByIdQuery({
    id: testId?.toString() || "",
  });

  const {
    reset,
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm<UpdateTest>();

  const { mutate: updateTest, isPending: isPendingUpdateTest } = useMutation({
    mutationKey: ["update-test"],
    mutationFn: async (data: UpdateTest) => {
      const response = await $api.organization
        .test({ id: testId?.toString() || "" })
        .put(data);

      return response.data;
    },
    onSuccess(data) {
      if (!data) {
        throw new Error("Failed to update test. Please try again later.");
      }

      reset(data);
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = (data: UpdateTest) => {
    updateTest(data);
  };

  if (isPending) {
    return <Skeleton className="w-full h-[80dvh]" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col divide-y divide-dashed">
        <SettingSection
          title="Type"
          description="This determines how candidates will interact with your assessment."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="w-full p-3 border-foreground cursor-pointer relative">
              <CheckCircle2 size={18} className="absolute top-2 right-2" />
              <h3 className="font-medium mb-2">Self-paced Test</h3>
              <Label className="font-normal">
                Allow candidates to take the test at their own pace. Ideal for
                screening and pre-assessment purposes.
              </Label>
            </Card>

            <Card className="w-full p-3 opacity-70 ring-offset-4 ring-foreground/50 transition-all relative">
              <LockIcon
                size={18}
                className="absolute top-2 right-2 opacity-50"
              />
              <h3 className="font-medium mb-2">Live Test</h3>
              <Label className="font-normal">
                Schedule a synchronized test for all candidates. Ideal for final
                assessments and examinations.
              </Label>
            </Card>
          </div>
        </SettingSection>

        <SettingSection
          title="Access"
          description="Control who can access your test. Public tests are visible to anyone."
        >
          <Controller
            name="access"
            control={control}
            defaultValue="public"
            render={({ field }) => (
              <Tabs
                className="w-full"
                defaultValue="public"
                value={field.value || "public"}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateTest({ access: value as "public" | "invite-only" });
                }}
              >
                <TabsList className="mb-2">
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="invite-only">Invite Only</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                  <Label className="text-sm font-normal">
                    Anyone with the link can access and take this test. The test
                    will be publicly listed on your profile.
                  </Label>
                </TabsContent>
                <TabsContent value="invite-only">
                  <InviteOnly testId={testId?.toString() || ""} />
                </TabsContent>
              </Tabs>
            )}
          />
        </SettingSection>

        <SettingSection
          title="Section Selection Mode"
          description="Control how candidates will navigate through the test sections."
        >
          <Controller
            name="sectionSelectionMode"
            control={control}
            defaultValue="random"
            render={({ field }) => (
              <Tabs
                className="w-full"
                defaultValue="random"
                value={field.value || "random"}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <TabsList className="mb-2">
                  <TabsTrigger value="random">Random</TabsTrigger>
                  <TabsTrigger value="sequential">Sequential</TabsTrigger>
                </TabsList>
                <TabsContent value="random">
                  <Label className="text-sm font-normal">
                    Candidates will be able to choose any section to start with.
                  </Label>
                </TabsContent>
                <TabsContent value="sequential">
                  <Label className="text-sm font-normal">
                    Candidates will navigate through sections in a predetermined
                    order.
                  </Label>
                </TabsContent>
              </Tabs>
            )}
          />
        </SettingSection>

        <SettingSection
          title="Result Visibility"
          description="Control when participants can see their test results."
        >
          <Controller
            name="resultVisibility"
            control={control}
            defaultValue="never"
            render={({ field }) => (
              <>
                <Select
                  value={field.value || "never"}
                  onValueChange={(value) => {
                    if (!value) return;
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-3xs">
                    <SelectValue placeholder="Select when to show results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after_completion">
                      <Timer className="h-4 w-4 mr-2" /> After Completion
                    </SelectItem>
                    <SelectItem value="after_test_end">
                      <Clock className="h-4 w-4 mr-2" /> After Test End
                    </SelectItem>
                    <SelectItem value="never">
                      <ShieldOff className="h-4 w-4 mr-2" /> Do not show results
                    </SelectItem>
                  </SelectContent>
                </Select>

                {field.value === "after_completion" && (
                  <Label className="text-sm font-normal text-muted-foreground block">
                    Participants will see their results immediately after submitting the test. Best for practice assessments where instant feedback is valuable.
                  </Label>
                )}
                {field.value === "after_test_end" && (
                  <Label className="text-sm font-normal text-muted-foreground block">
                    Participants will see their results only after the scheduled end date of the test. Ideal for formal assessments where you want everyone to finish before seeing results.
                  </Label>
                )}
                {field.value === "never" && (
                  <Label className="text-sm font-normal text-muted-foreground block">
                    Results will only be visible to you as the administrator. Use this when you want to review responses before sharing results with participants.
                  </Label>
                )}
              </>
            )}
          />
        </SettingSection>

        <SettingSection
          title="Description"
          description="Add a description to provide more information about your test to candidates."
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                placeholder="Type test's description here...."
                value={field.value || ""}
                className="resize-none min-h-[140px] text-base p-4 w-full"
                onChange={field.onChange}
              />
            )}
          />
        </SettingSection>
      </div>

      <div className="fixed w-full bottom-0 left-0 flex flex-row items-center justify-end gap-4 px-4 sm:px-8 py-4 border-t bg-background z-50">
        <div className="container">
          <Button
            disabled={!isDirty}
            type="submit"
            variant={isDirty ? "default" : "outline-solid"}
          >
            {isPendingUpdateTest ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Setting;
