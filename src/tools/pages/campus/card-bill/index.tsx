import type { CardHistoryItem, CardRecordRequestType } from "@/apis/models/card"
import { Picker, View } from "@tarojs/components"
import { hideToast, showToast } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useRequest } from "@/hooks/request"
import EmptyIcon from "@/static/tools/campus/card-bill/empty.svg"
import { Detail } from "@/tools/pages/campus/card-bill/components/detail"
import dayjs from "@/utils/dayjs"

type TabValue = CardRecordRequestType

export default function CardBill() {
  // Tab 值
  const [tab, setTab] = useState<TabValue>("consumption")

  // 选择值
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1)

  // picker 值
  const picker = dayjs([selectedYear, selectedMonth - 1]).format("YYYY-MM-DD")

  // 详情弹窗
  const [activeRecord, setActiveRecord] = useState<CardHistoryItem | null>(null)

  const { data, isLoading, refetch } = useRequest(
    () => api.card.record({ type: tab, year: selectedYear, month: selectedMonth }),
    [tab, selectedYear, selectedMonth],
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
          <TabTrigger value="consumption">消费</TabTrigger>
          <TabTrigger value="recharge">充值</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent
        onRefresh={() => refetch()}
        className="h-full"
      >
        <View className="flex flex-col p gap">
          <Card>
            <CardContent className="flex items-center gap-sm">
              <View className="text-lg">选择年份/月份</View>
              <View className="flex-1">
                <Picker
                  mode="date"
                  fields="month"
                  value={picker}
                  onChange={(e) => {
                    const newDate = dayjs(e.detail.value, "YYYY-MM")
                    setSelectedYear(newDate.year())
                    setSelectedMonth(newDate.month() + 1)
                  }}
                >
                  <View className="flex items-center justify-end text-primary">
                    <View>
                      {selectedYear}
                      {" 年 "}
                      {selectedMonth}
                      {" 月 "}
                    </View>
                  </View>
                </Picker>
              </View>
            </CardContent>
          </Card>

          {data && data.count > 0 && data.records.length > 0 && (
            <View className="flex center text-toned py">
              共
              {" "}
              {data.count}
              {" "}
              次
              {tab === "consumption" ? "消费" : "充值"}
              ,
              {" "}
              共计
              {" "}
              {data.total.toFixed(2)}
              {" "}
              元
            </View>
          )}

          {data && data.count > 0 && data.records.length > 0
            ? (
                <View className="flex flex-col gap">
                  {data!.records.map(record => (
                    <Card
                      key={record.id}
                      onClick={() => setActiveRecord(record)}
                    >
                      <CardContent className="flex flex-col gap-sm">
                        <View className="flex justify-between items-center">
                          <View className="text-lg text-primary">
                            {dayjs(record.date_time).format("YYYY-MM-DD HH:mm:ss")}
                          </View>
                          <View className="text-lg font-bold text-hightlight">
                            {tab === "recharge" ? "+" : "-"}
                            {record.amount.toFixed(2)}
                          </View>
                        </View>
                        <View className="flex justify-between items-center">
                          <View className="text-toned">
                            消费地点:
                            {" "}
                            {record.location || record.name}
                          </View>
                          <View className="text-toned">
                            {`余额: ${record.now_balance.toFixed(2)}`}
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  ))}
                </View>
              )
            : (
                <View className="h-full flex flex-col center gap py-xl">
                  <Icon className="size-xl" src={EmptyIcon} />
                  <View className="text-toned">未找到相关记录</View>
                </View>
              )}
        </View>
      </PageContent>

      {activeRecord && (
        <Overlay>
          <Detail
            record={activeRecord}
            onClose={() => setActiveRecord(null)}
          />
        </Overlay>
      )}
    </Page>
  )
}
