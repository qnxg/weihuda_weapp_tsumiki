import { useState } from "react"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { CA } from "@/tools/pages/grade/ranking/components/ca"
import { HDJW } from "@/tools/pages/grade/ranking/components/hdjw"

type TabValue = "hdjw" | "ca"

export default function Ranking() {
  const [tab, setTab] = useState<TabValue>("hdjw")

  return (
    <Page>
      <Tabs
        defaultValue="hdjw"
        onChange={(value: TabValue) => setTab(value)}
      >
        <TabList>
          <TabTrigger value="hdjw">教务系统</TabTrigger>
          <TabTrigger value="ca">可信电子凭证</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent>
        {tab === "hdjw" ? <HDJW /> : <CA />}
      </PageContent>
    </Page>
  )
}
