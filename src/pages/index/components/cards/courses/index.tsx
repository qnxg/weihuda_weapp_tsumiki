import { useEffect, useState } from "react"
import { Card, CardHeader } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { Skeleton } from "@/components/skeleton"
import { TabContent, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import CoursesIcon from "@/static/index/courses.svg"
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
    mockRequest({ today: "今日课程", tomorrow: "明日课程" }, { errorRate: 0.2 }),
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
        icon={CoursesIcon}
        title="我的课程"
        action="更多"
        to="/pages/table/index"
      />
      <IndexCardContent
        className=""
        isLoading={isLoading}
        isFailed={!data}
        onRefresh={refetch}
      >
        <Tabs
          className="flex flex-col gap"
          value={tab}
        >
          {data
            ? (
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
              )
            : (
                <Skeleton
                  className="w-full"
                  style={{
                    height: "48rpx",
                  }}
                />
              )}
          <TabContent className="w-full h-lg flex center">
            {data
              ? (
                  tab === "today" ? data.today : data.tomorrow
                )
              : <Skeleton className="w-full h" />}
          </TabContent>
        </Tabs>
      </IndexCardContent>
    </Card>
  )
}
