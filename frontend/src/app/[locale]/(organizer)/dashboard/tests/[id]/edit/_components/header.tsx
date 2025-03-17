import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlertIcon, ClockIcon, Loader2, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { UpdateTest } from "@evaly/backend/types/test";
import { useMutation } from "@tanstack/react-query";
import { $api } from "@/lib/api";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import DialogPublishTest from "@/components/shared/dialog/dialog-publish-test";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProgressRouter } from "@/components/shared/progress-bar";
import BackButton from "@/components/shared/back-button";
import { useTestSectionByTestIdQuery } from "@/query/organization/test-section/use-test-section-by-test-id";

const Header = () => {
  const { id } = useParams();

  const router = useProgressRouter();

  const { data: dataTest, isPending: isPendingTest } = useTestByIdQuery({
    id: id?.toString() || "",
  });

  const { mutate: updateTest, isPending: isPendingUpdateTest } = useMutation({
    mutationKey: ["update-test"],
    mutationFn: async (data: UpdateTest) => {
      const response = await $api.organization
        .test({ id: id?.toString() || "" })
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

  const {
    register,
    reset,
    formState: { isDirty },
    watch,
    getValues,
  } = useForm<UpdateTest>();

  const testId = watch("id");
  const isPublished = watch("isPublished");

  useEffect(() => {
    if (dataTest) {
      reset(dataTest);
    }
  }, [dataTest, reset]);

  const { data: dataSections } = useTestSectionByTestIdQuery({
    testId: id?.toString() || "",
  });

  const { hours, minutes, totalDuration } = useMemo(() => {
    if (!dataSections?.length) return { hours: 0, minutes: 0 };

    const totalDuration = dataSections.reduce((acc, section) => {
      return acc + (section.duration || 0);
    }, 0);

    return {
      hours: Math.floor(totalDuration / 60),
      minutes: totalDuration % 60,
      totalDuration,
    };
  }, [dataSections]);

  if (!isPendingTest && !dataTest) {
    return notFound();
  }

  return (
    <>
      <BackButton
        className="mb-2"
        href={isPublished ? `/dashboard/tests/${id}` : `/dashboard`}
      />
      <input
        {...register("title")}
        className="outline-none text-xl font-medium"
        placeholder="Test title"
        disabled={isPendingTest}
      />
      <AnimatePresence>
        {isDirty && !isPendingTest && testId ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-max"
          >
            <Button
              variant={"outline-solid"}
              disabled={isPendingUpdateTest}
              className="mt-2 w-max"
              size={"sm"}
              onClick={() =>
                updateTest({
                  title: getValues("title"),
                })
              }
            >
              {isPendingUpdateTest ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save />
              )}
              Save
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-4 mt-2 flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="flex flex-row items-center gap-2">
          {totalDuration ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} className="text-foreground/75">
                  <ClockIcon /> Total duration: {hours > 0 ? `${hours}h ` : ""}
                  {minutes}m
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                If you want participants to be able to finish the test whenever
                they want, you can leave the duration empty.
              </PopoverContent>
            </Popover>
          ) : null}
          {!isPublished ? (
            <DialogPublishTest
              testId={id?.toString() || ""}
              onPublished={(newTest) => {
                reset(newTest);
                router.replace(`/dashboard/tests/${newTest.id}?tabs=share`);
              }}
            />
          ) : null}
        </div>
      </div>

      {isPublished && (
        <div className="bg-warning text-warning-foreground p-4 flex flex-row items-start border-warning-foreground/20 border mb-4">
          <CircleAlertIcon className="size-6 mr-4" />
          <div className="flex-1 -mt-1 font-medium">
            <p>
              This test is published and can be taken by participants, every
              change you make will be reflected on the test.
            </p>
            <p>Please be careful when making changes.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
