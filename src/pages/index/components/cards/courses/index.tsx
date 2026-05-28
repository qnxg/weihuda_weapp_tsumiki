import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { TabContent, TabList, Tabs, TabTrigger } from "@/components/tabs"

type TabValue = "today" | "tomorrow"

/**
 * @description 课程
 */
export function Courses() {
  const [tab, setTab] = useState<TabValue>("today")

  return (
    <Card>
      <CardHeader
        title="我的课程"
      />
      <CardContent>
        <Tabs
          className="flex flex-col gap"
          value={tab}
        >
          <TabList>
            <TabTrigger asChild value="today">
              <MyButton
                className="flex-1 flex center rounded-sm"
                active={tab === "today"}
                onClick={() => setTab("today")}
              >
                今日
              </MyButton>
            </TabTrigger>
            <TabTrigger asChild value="today">
              <MyButton
                className="flex-1 flex center rounded-sm"
                active={tab === "tomorrow"}
                onClick={() => setTab("tomorrow")}
              >
                明日
              </MyButton>
            </TabTrigger>
          </TabList>
          <TabContent className="w-full h-lg flex center">
            {tab === "today" ? "今日课程" : "明日课程"}
          </TabContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
