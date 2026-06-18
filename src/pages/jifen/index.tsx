import { View } from "@tarojs/components"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Page, PageContent } from "@/components/page"
import { TabContent, TabItem, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useRequest } from "@/hooks/request"
import { Goods } from "@/pages/jifen/components/goods"
import { Record } from "@/pages/jifen/components/record"
import { Rule } from "@/pages/jifen/components/rule"
import { ScrollProvider, useScrollContext } from "@/pages/jifen/contexts/scroll"

function JifenContent() {
  const { setIsScrollToLower } = useScrollContext()

  const { data } = useRequest(() => api.jifen.get())

  return (
    <Page>
      <PageContent
        className="px"
        lowerThreshold={50}
        onScrollToLower={() => setIsScrollToLower(true)}
      >
        <View className="flex flex-col gap">
          <Card>
            <CardContent className="flex items-center justify-between p">
              <View className="flex flex-col center gap">
                <View className="text-xl text-bold text-primary">
                  {data ? data.jifen : "---"}
                </View>
                <View>当前积分</View>
              </View>
              <View className="flex flex-col center gap">
                <View className="text-xl text-bold text-primary">
                  {data ? data.combo : "---"}
                </View>
                <View>连续签到</View>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Tabs defaultValue="record">
                <TabList>
                  <TabTrigger value="record">积分记录</TabTrigger>
                  <TabTrigger value="goods">兑换奖品</TabTrigger>
                  <TabTrigger value="rule">积分规则</TabTrigger>
                </TabList>
                <TabContent>
                  <TabItem value="record">
                    <Record />
                  </TabItem>
                  <TabItem value="goods">
                    <Goods jifen={data?.jifen ?? 0} />
                  </TabItem>
                  <TabItem value="rule">
                    <Rule />
                  </TabItem>
                </TabContent>
              </Tabs>
            </CardContent>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}

export default function Jifen() {
  return (
    <ScrollProvider>
      <JifenContent />
    </ScrollProvider>
  )
}
