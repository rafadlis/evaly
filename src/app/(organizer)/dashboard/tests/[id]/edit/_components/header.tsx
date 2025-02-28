import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/trpc/trpc.client";
import { ClockIcon, Rocket } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const Header = () => {
  const { id } = useParams();
  const { data: test } = trpc.organization.session.sessionByTestId.useQuery(
    { testId: id as string },
    {
      enabled: !!id,
    }
  );

  const { hours, minutes } = useMemo(() => {
    if (!test) return { hours: 0, minutes: 0 };

    const totalDuration = test.reduce((acc, session) => {
      return acc + (session.duration || 0);
    }, 0);

    return {
      hours: Math.floor(totalDuration / 60),
      minutes: totalDuration % 60,
    };
  }, [test]);

  return (
    <>
      <input
        className="outline-none text-4xl font-bold"
        placeholder="Test title"
      />

      <div className="mb-6 mt-4 flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="flex flex-row items-center gap-4">
          <Button variant={"ghost"} className="text-foreground/75">
            <ClockIcon /> Total duration: {hours > 0 ? `${hours}h ` : ''}{minutes}m
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
