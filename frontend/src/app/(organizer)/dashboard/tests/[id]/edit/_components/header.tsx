import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockIcon, Loader2, Rocket, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { UpdateTest } from "@evaly/backend/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { $api } from "@/lib/api";

const Header = () => {
  const { id } = useParams();

  const {
    data: dataTest,
    isPending: isPendingTest,
    refetch: refetchTest,
  } = useQuery({
    queryKey: ["tests", id],
    queryFn: async () => {
      const response = await $api.organization
        .test({ id: id?.toString() || "" })
        .get();
      return response.data;
    },
    enabled: !!id,
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

      refetchTest();
      reset(data);
    },
  });

  const {
    register,
    reset,
    formState: { isDirty },
    getValues,
  } = useForm<UpdateTest>();

  useEffect(() => {
    if (dataTest) {
      reset(dataTest);
    }
  }, [dataTest, reset]);

  const { data: dataSessions } = useQuery({
    queryKey: ["sessions-by-test-id", id],
    queryFn: async () => {
      const response = await $api.organization.test.session.all.get({
        query: { testId: id as string },
      });
      return response.data?.sessions
    },
    enabled: !!id,
  });

  const { hours, minutes } = useMemo(() => {
    if (!dataSessions?.length) return { hours: 0, minutes: 0 };

    const totalDuration = dataSessions.reduce((acc, session) => {
      return acc + (session.duration || 0);
    }, 0);

    return {
      hours: Math.floor(totalDuration / 60),
      minutes: totalDuration % 60,
    };
  }, [dataSessions]);

  return (
    <>
      <input
        {...register("title")}
        className="outline-none text-4xl font-bold"
        placeholder="Test title"
        disabled={isPendingTest}
      />
      <AnimatePresence>
        {isDirty && !isPendingTest && (
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
        )}
      </AnimatePresence>

      <div className="mb-6 mt-4 flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="flex flex-row items-center gap-4">
          <Button variant={"ghost"} className="text-foreground/75">
            <ClockIcon /> Total duration: {hours > 0 ? `${hours}h ` : ""}
            {minutes}m
          </Button>
          <Button>
            <Rocket /> Publish
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
