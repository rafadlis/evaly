"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import Questions from "./_components/questions/questions";
import Header from "./_components/header";
import Setting from "./_components/setting/setting";
import { useTabsState } from "./_hooks/use-tabs-state";
import BackButton from "@/components/shared/back-button";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import { notFound, useParams } from "next/navigation";
const DetailTestPage = () => {
  const [tabs, setTabs] = useTabsState("questions");
  const { id } = useParams();

  const { data: dataTest, isPending: isPendingTest } = useTestByIdQuery({
    id: id?.toString() || "",
  });

  if (!isPendingTest && !dataTest) {
    return notFound();
  }

  return (
    <div className="container min-h-dvh pb-10">
      <BackButton className="mb-2" fallbackUrl="/dashboard" />
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
