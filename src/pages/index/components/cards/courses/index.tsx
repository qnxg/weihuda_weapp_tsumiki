import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { TabContent, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import { mockRequest } from "@/utils/mock-request"

type TabValue = "today" | "tomorrow"

/**
 * @description 课程
 */
export function Courses({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ today: "今日课程", tomorrow: "明日课程" }),
  )

  const [tab, setTab] = useState<TabValue>("today")

  useEffect(() => {
    registerCard(cardKey, refetch)
  }, [registerCard, refetch, cardKey])

  useEffect(() => {
    if (!isLoading) {
      onCardFinish(cardKey)
    }
  }, [isLoading, onCardFinish, cardKey])

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
            {tab === "today" ? data?.today : data?.tomorrow}
          </TabContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
