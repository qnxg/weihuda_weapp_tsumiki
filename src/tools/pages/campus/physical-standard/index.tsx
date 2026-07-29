import { View } from "@tarojs/components"
import { useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { Female } from "./components/female"
import { Intro } from "./components/intro"
import { Male } from "./components/male"

type TabValue = "intro" | "male" | "female"

export default function PhysicalStandard() {
  const [tab, setTab] = useState<TabValue>("intro")

  return (
    <Page>
      <Tabs
        value={tab}
        onChange={(value: TabValue) => setTab(value)}
      >
        <TabList>
          <TabTrigger value="intro">简介</TabTrigger>
          <TabTrigger value="male">男生</TabTrigger>
          <TabTrigger value="female">女生</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent className="h-full">
        <View className="flex p">
          <Card className="w-full">
            <CardContent>
              {tab === "intro" && <Intro />}
              {tab === "male" && <Male />}
              {tab === "female" && <Female />}
            </CardContent>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}
