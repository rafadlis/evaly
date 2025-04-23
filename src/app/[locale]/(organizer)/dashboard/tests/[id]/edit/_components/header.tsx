import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlertIcon, ClockIcon, Loader2, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { UpdateTest } from "@/types/test";
import DialogPublishTest from "@/components/shared/dialog/dialog-publish-test";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProgressRouter } from "@/components/shared/progress-bar";
import BackButton from "@/components/shared/back-button";
import { useTranslations } from "next-intl";
import { trpc } from "@/trpc/trpc.client";
import { toast } from "sonner";

const Header = () => {
  const { id } = useParams();

  const router = useProgressRouter();
  const tCommon = useTranslations("Common");
  const t = useTranslations("TestDetail");
  const { data: dataTest, isPending: isPendingTest } =
    trpc.organization.test.getById.useQuery({
      id: id?.toString() || "",
    });

  const { mutate: updateTest, isPending: isPendingUpdateTest } =
    trpc.organization.test.update.useMutation({
      onSuccess(data) {
        reset(data);
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  const {
    register,
    reset,
    formState: { isDirty },
    watch,
    getValues,
  } = useForm<UpdateTest>();

  const isPublished = watch("isPublished");

  useEffect(() => {
    if (dataTest) {
      reset(dataTest);
    }
  }, [dataTest, reset]);

  const { data: dataSections } = trpc.organization.testSection.getAll.useQuery({
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
        type="text"
        {...register("title")}
        className="outline-none text-xl font-medium"
        placeholder={isPendingTest ? "Loading..." : "Test title"}
        disabled={isPendingTest || isPendingUpdateTest}
      />

      <AnimatePresence>
        {isDirty && isPendingTest === false ? (
          <motion.div
            key={"save-button"}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="w-max"
          >
            <Button
              variant={"default"}
              disabled={isPendingUpdateTest}
              className="w-max"
              size={"sm"}
              onClick={() =>
                updateTest({
                  id: id?.toString() || "",
                  title: getValues("title"),
                })
              }
            >
              {isPendingUpdateTest ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              {tCommon("saveButton")}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-4 mt-2 flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="questions">{t("questionsTab")}</TabsTrigger>
          <TabsTrigger value="settings">{t("settingsTab")}</TabsTrigger>
        </TabsList>

        <div className="flex flex-row items-center gap-2">
          {totalDuration ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} className="text-foreground/75">
                  <ClockIcon /> {tCommon("totalDuration")}:{" "}
                  {hours > 0 ? `${hours}h ` : ""}
                  {minutes}m
                </Button>
              </PopoverTrigger>
              <PopoverContent>{t("totalDurationPopover")}</PopoverContent>
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
            <p>{t("publishedTest")}</p>
            <p>{t("publishedTestDescription")}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
