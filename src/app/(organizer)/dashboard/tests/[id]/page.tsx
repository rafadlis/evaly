"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import Questions from "./questions/questions";
import Header from "./header";
import Setting from "./setting/setting";

const DetailTestPage = () => {
  return (
    <div className="container min-h-dvh">
      <Tabs defaultValue="questions">
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
