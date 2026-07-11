import type { CardRecordItem, CardRecordRequestType } from "@/apis/models/card"
import { Picker, View } from "@tarojs/components"
import { hideLoading, showLoading } from "@tarojs/taro"
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
import { od } from "@/utils/ohday"

type TabValue = CardRecordRequestType

export default function CardBill() {
  // Tab 值
  const [tab, setTab] = useState<TabValue>("consumption")

  // 选择值
  const [selectedDate, setSelectedDate] = useState(() => od().cs("M").s)

  // picker 值
  const picker = od(selectedDate).p("YYYY-MM-DD")

  // 详情弹窗
  const [activeRecord, setActiveRecord] = useState<CardRecordItem | null>(null)

  const { data, isLoading, refetch } = useRequest(
    () => api.card.record({ type: tab, year: od(selectedDate).year, month: od(selectedDate).month }),
    [tab, selectedDate],
    { refetchClearData: false },
  )

  useEffect(() => {
    if (isLoading) {
      void showLoading({
        title: "加载中...",
      })
    }
    else {
      hideLoading()
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
                    setSelectedDate(od(e.detail.value, "YYYY-MM").s)
                  }}
                >
                  <View className="flex items-center justify-end text-primary">
                    <View>
                      {od(selectedDate).year}
                      {" 年 "}
                      {od(selectedDate).month}
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
                            {od(record.date_time).s}
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
