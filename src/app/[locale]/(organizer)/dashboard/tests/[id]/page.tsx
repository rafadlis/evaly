"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "./_components/header";
import { useTabsState } from "./_hooks/use-tabs-state";
import Submissions from "./_components/submissions";
import Share from "./_components/share";
import Setting from "./_components/setting/setting";
import Questions from "./_components/questions/questions";

const Page = () => {
  const [tab, setTab] = useTabsState("questions");

  return (
    <Tabs
      className="container min-h-dvh pb-10 dashboard-margin"
      defaultValue="questions"
      value={tab}
      onValueChange={setTab}
    >
      <Header />
      <TabsContent value="settings">
        <Setting />
      </TabsContent>
      <TabsContent value="submissions">
        <Submissions />
      </TabsContent>
      <TabsContent value="questions">
        <Questions />
      </TabsContent>
      <TabsContent value="share">
        <Share />
      </TabsContent>
    </Tabs>
  );
};

export default Page;
