import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Page, PageContent } from "@/components/page"
import { TabContent, TabItem, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { Female } from "./components/female"
import { Intro } from "./components/intro"
import { Male } from "./components/male"

export default function PhysicalStandard() {
  return (
    <Page>
      <PageContent className="h-full">
        <View className="flex flex-col gap p">
          <Card>
            <CardContent>
              <Tabs defaultValue="intro">
                <TabList>
                  <TabTrigger value="intro">简介</TabTrigger>
                  <TabTrigger value="male">男生</TabTrigger>
                  <TabTrigger value="female">女生</TabTrigger>
                </TabList>
                <TabContent>
                  <TabItem value="intro">
                    <Intro />
                  </TabItem>
                  <TabItem value="male">
                    <Male />
                  </TabItem>
                  <TabItem value="female">
                    <Female />
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
