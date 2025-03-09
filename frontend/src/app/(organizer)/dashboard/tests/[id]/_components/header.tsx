"use client";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkIcon } from "lucide-react";
import { notFound, redirect, useParams } from "next/navigation";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import { Link } from "@/components/shared/progress-bar";
import { toast } from "sonner";
import { env } from "@/lib/env";

const Header = () => {

  const { id } = useParams();

  const {
    data: dataTest,
    isPending: isPendingTest,
    isRefetching: isRefetchingTest,
  } = useTestByIdQuery({
    id: id?.toString() || "",
  });

  const copyLinkToShare = () => {
    navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_URL}/join/${dataTest?.id}`
    );
    toast.success("Link copied to clipboard",{position: "top-right"});
  };

  if (!isPendingTest && !dataTest) {
    return notFound();
  }

  if (!dataTest?.isPublished && !isPendingTest && !isRefetchingTest) {
    return redirect(`/dashboard/tests/${id}/edit`);
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        {isPendingTest ? (
          <h1 className="animate-pulse text-muted-foreground text-4xl font-bold">
            Loading...
          </h1>
        ) : (
          <h1 className="text-4xl font-bold">{dataTest?.title}</h1>
        )}
        <div className="flex flex-row items-center gap-2">
          <Button variant={"ghost"} size={"icon"} onClick={copyLinkToShare}>
            <LinkIcon />
          </Button>
          <Link href={`/dashboard/tests/${id}/edit`}>
            <Button variant={"outline-solid"}>Edit</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 mt-4 flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </div>
    </>
  );
};

export default Header;
