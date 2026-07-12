import type { Semester, XQ } from "@/types/semester"
import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useSemester } from "@/hooks/semester"
import EmptyIcon from "@/static/tools/campus/calender/empty.svg"
import { cn } from "@/utils/cn"
import { od } from "@/utils/ohday"
import { getSemesterDateInfo, getSemesterName } from "@/utils/semester"

export default function Calender() {
  // 学期标识符
  const [displaySemester, setDisplaySemester] = useState<Semester | null>(null)

  const { data, isLoading } = useSemester(displaySemester ?? undefined)

  const [tab, setTab] = useState<XQ>("autumn")

  // 学期切换
  useEffect(() => {
    if (!data)
      return

    // 阻止重复设置学期
    if (tab === displaySemester?.xq)
      return

    const newDisplaySemester = {
      xn: data.xn,
      xq: tab,
    }
    setDisplaySemester(newDisplaySemester)
  }, [displaySemester?.xq, data, tab])

  // 当前学期就绪后初始显示当前学期
  useEffect(() => {
    if (displaySemester)
      return

    if (isLoading)
      return

    if (data)
      setTab(data.xq)
  }, [displaySemester, isLoading, data])

  return (
    <Page>
      <Tabs
        value={tab}
        onChange={(e: XQ) => setTab(e)}
      >
        <TabList>
          <TabTrigger value="autumn">秋季</TabTrigger>
          <TabTrigger value="winter">寒假</TabTrigger>
          <TabTrigger value="spring">春季</TabTrigger>
          <TabTrigger value="summer">夏季</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent
        className="h-full"
        isLoading={isLoading && !data}
      >
        {data
          ? (
              <View className="flex p">
                <Card className="w-full">
                  <CardContent className="flex flex-col gap">
                    <View className="flex flex-col gap-sm">
                      <View className="text-xl">{getSemesterName(data)}</View>
                      <View className="text-toned text-sm">
                        {getSemesterDateInfo(data).start.p("YYYY.M.D")}
                        {" - "}
                        {getSemesterDateInfo(data).end.p("YYYY.M.D")}
                      </View>
                    </View>

                    <View
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(8, 1fr)",
                      }}
                    >
                      {/* 左上角空白方块 */}
                      <View />

                      {/* 日显示条 */}
                      {["日", "一", "二", "三", "四", "五", "六"].map(item => (
                        <View
                          key={item}
                          className="flex center text-xl py"
                        >
                          {item}
                        </View>
                      ))}

                      {/* 周显示条 */}
                      <View
                        style={{
                          gridColumn: "1",
                          gridRow: `2 / span ${data.weeks}`,
                        }}
                      >
                        {Array.from({ length: data.weeks }).map((_, i) => (
                          <View
                            key={i}
                            className="flex center text-xl text-toned py"
                          >
                            {i + 1}
                          </View>
                        ))}
                      </View>

                      {/* 主内容区 */}
                      <View
                        style={{
                          display: "contents",
                          gridColumn: "2 / span 7",
                        }}
                      >
                        {Array.from({ length: data.weeks }).map((_, week) =>
                          Array.from({ length: 7 }).map((_, day) => {
                            const start = od(data.start)
                            const date = start.add("w", week).add("d", day)
                            return (
                              <View
                                key={`${week}-${day}`}
                                className={cn(
                                  "flex center text-lg",
                                  date.date === 1 && "text-hightlight",
                                  (date.month - start.month) % 2 === 1 && "bg-page",
                                  od().eq(date, "d") && "bg-primary text-reverse",
                                )}
                              >
                                {date.date === 1 ? `${date.month}月` : date.date}
                              </View>
                            )
                          }))}
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            )
          : (
              <View className="h-full flex flex-col center gap">
                <Icon className="size-xl" src={EmptyIcon} />
                <View>信息加载失败</View>
              </View>
            )}
      </PageContent>
    </Page>
  )
}
