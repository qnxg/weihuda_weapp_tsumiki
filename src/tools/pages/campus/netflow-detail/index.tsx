import type { NetflowDetailItem, NetflowDetailRequestType } from "@/apis/models/netflow"
import { View } from "@tarojs/components"
import { hideToast, showToast } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Options } from "@/components/options"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useRequest } from "@/hooks/request"
import EmptyIcon from "@/static/tools/campus/netflow-detail/empty.svg"
import { DayPicker } from "@/tools/pages/campus/netflow-detail/components/day-picker"
import { Detail } from "@/tools/pages/campus/netflow-detail/components/detail"
import { MonthPicker } from "@/tools/pages/campus/netflow-detail/components/month-picker"
import { parseNetflowItemName } from "@/tools/pages/campus/netflow-detail/utils/detail"
import dayjs from "@/utils/dayjs"

type TabValue = NetflowDetailRequestType

export default function NetflowDetail() {
  // Tab 值
  const [tab, setTab] = useState<TabValue>("month")

  // 选择值
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1)
  const [selectedDay, setSelectedDay] = useState(dayjs().date())

  // 详情弹窗
  const [activeItem, setActiveItem] = useState<NetflowDetailItem | null>(null)

  const { data, isLoading, refetch } = useRequest(
    () => api.netflow.getDetail({
      type: tab,
      year: selectedYear,
      month: selectedMonth,
      day: tab === "month" ? undefined : selectedDay,
    }),
    [tab, selectedYear, selectedMonth, selectedDay],
    { refetchClearData: false },
  )

  useEffect(() => {
    if (isLoading) {
      void showToast({
        title: "加载中",
        icon: "loading",
      })
    }
    else {
      hideToast()
    }
  }, [isLoading])

  return (
    <Page>
      <Tabs
        value={tab}
        onChange={(e: TabValue) => setTab(e)}
      >
        <TabList>
          <TabTrigger value="month">按月查询</TabTrigger>
          <TabTrigger value="day">按天查询</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent
        onRefresh={() => refetch()}
        className="h-full"
      >
        <View className="flex flex-col p gap">
          <Card>
            <CardContent className="flex items-center gap-sm">
              <View className="text-lg">
                {tab === "month" ? "选择年份/月份" : "选择年份/月份/日"}
              </View>
              <View className="flex-1">
                {tab === "month"
                  ? (
                      <MonthPicker
                        year={selectedYear}
                        month={selectedMonth}
                        onChange={(year, month) => {
                          setSelectedYear(year)
                          setSelectedMonth(month)
                        }}
                      />
                    )
                  : (
                      <DayPicker
                        year={selectedYear}
                        month={selectedMonth}
                        day={selectedDay}
                        onChange={(year, month, day) => {
                          setSelectedYear(year)
                          setSelectedMonth(month)
                          setSelectedDay(day)
                        }}
                      />
                    )}
              </View>
            </CardContent>
          </Card>

          {data && data.items.length > 0
            ? (
                <Card>
                  <CardContent className="flex flex-col gap">
                    <View className="flex items-center justify-between p">
                      <View className="flex items-end">
                        <View className="text-2xl font-bold">
                          {data.items.length}
                        </View>
                        {" "}
                        个项目
                      </View>
                      <View className="text-xl font-bold">
                        总量:
                        {" "}
                        {data.total}
                      </View>
                    </View>

                    <Options>
                      {data.items.map((item, index) => {
                        const { title, content } = parseNetflowItemName(item.name)
                        return (
                          <Card
                            key={`${item.name}-${index}`}
                            className="bg"
                            onClick={() => setActiveItem(item)}
                          >
                            <CardContent className="flex items-center justify-between">
                              <View className="flex flex-col">
                                <View className="text-lg">
                                  {title}
                                </View>
                                <View className="text-lg text-toned">
                                  {content}
                                </View>
                              </View>
                              <View className="text-xl">
                                {item.total}
                              </View>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </Options>
                  </CardContent>
                </Card>
              )
            : (
                <View className="h-full flex flex-col center gap py-xl">
                  <Icon className="size-xl" src={EmptyIcon} />
                  <View className="text-toned">未找到相关记录</View>
                </View>
              )}
        </View>
      </PageContent>

      {activeItem && (
        <Overlay>
          <Detail
            item={activeItem}
            onClose={() => setActiveItem(null)}
          />
        </Overlay>
      )}
    </Page>
  )
}
