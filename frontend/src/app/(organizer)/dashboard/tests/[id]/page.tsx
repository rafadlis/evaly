"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import Header from "./_components/header"
import Setting from "./_components/setting"
import { useTabsState } from "./edit/_hooks/use-tabs-state"

const Page = () => {
  const [tab, setTab] = useTabsState("summary");

  return (
    <Tabs className="container min-h-dvh pb-10" defaultValue="summary" value={tab} onValueChange={setTab}>
      <Header />
      <TabsContent value="settings">
        <Setting />
      </TabsContent>
    </Tabs>
  )
}

export default Page