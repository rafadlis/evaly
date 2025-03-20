"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import Header from "./_components/header"
import { useTabsState } from "./edit/_hooks/use-tabs-state"
import Submissions from "./_components/submissions"
import Share from "./_components/share"
import Setting from "./edit/_components/setting/setting"

const Page = () => {
  const [tab, setTab] = useTabsState("submissions");

  return (
    <Tabs className="container min-h-dvh pb-10" defaultValue="submissions" value={tab} onValueChange={setTab}>
      <Header />
      <TabsContent value="settings">
        <Setting />
      </TabsContent>
      <TabsContent value="submissions">
        <Submissions />
      </TabsContent>
      <TabsContent value="share">
        <Share />
      </TabsContent>
    </Tabs>
  )
}

export default Page