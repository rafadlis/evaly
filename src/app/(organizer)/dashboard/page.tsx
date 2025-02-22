"use client";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const DashboardPage = () => {
  const tests = [];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onCreateNewTest = () => {
    startTransition(() => {
      router.push("/dashboard/tests/123/edit");
    });
  };

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh text-center">
        <h1 className="text-xl font-semibold">No tests yet</h1>
        <h2 className="max-w-sm mt-2 text-muted-foreground">
          Create your first test and make assessment a breeze. Start building
          engaging questions today!
        </h2>
        <Button
          variant={"default"}
          className="mt-4"
          onClick={onCreateNewTest}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <PlusIcon size={16} />
          )}
          Create test
        </Button>
      </div>
    );
  }
  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
};

export default DashboardPage;
