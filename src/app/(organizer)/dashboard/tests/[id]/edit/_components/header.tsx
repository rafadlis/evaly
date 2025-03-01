import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateTest } from "@/lib/db/schema";
import { trpc } from "@/trpc/trpc.client";
import { ClockIcon, Loader2, Rocket, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const Header = () => {
  const { id } = useParams();

  const {
    data: dataTest,
    isPending: isPendingTest,
    refetch: refetchTest,
  } = trpc.organization.tests.byId.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    }
  );
  const { mutate: updateTest, isPending: isPendingUpdateTest } =
    trpc.organization.tests.update.useMutation({
      onSuccess: (data) => {
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

  const { data: dataSessions } =
    trpc.organization.session.sessionByTestId.useQuery(
      { testId: id as string },
      {
        enabled: !!id,
      }
    );

  const { hours, minutes } = useMemo(() => {
    if (!dataSessions) return { hours: 0, minutes: 0 };

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
                  id: id as string,
                  data: { title: getValues("title") },
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
