"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import Questions from "./_components/questions/questions";
import Header from "./_components/header";
import Setting from "./_components/setting/setting";
import { useTabsState } from "./_hooks/use-tabs-state";
import { notFound, redirect, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { trpc } from "@/trpc/trpc.client";

const DetailTestPage = () => {
  const [tabs, setTabs] = useTabsState("questions");
  const { id } = useParams();
  const locale = useLocale();

  const { data: dataTest, isPending: isPendingTest } = trpc.organization.test.getById.useQuery({
    id: id?.toString() || "",
  });

  if (!isPendingTest && !dataTest) {
    return notFound();
  }

  if (dataTest?.isPublished && dataTest?.finishedAt) {
    return redirect(`/${locale}/dashboard/tests/${id}`);
  }

  return (
    <div className="container min-h-dvh pb-10 dashboard-margin">
      <Tabs defaultValue="questions" value={tabs} onValueChange={setTabs}>
        <Header />
        <TabsContent value="questions">
          <Questions />
        </TabsContent>
        <TabsContent value="settings">
          <Setting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailTestPage;
