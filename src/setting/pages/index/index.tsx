import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import SettingIcon from "@/static/setting/index/setting.svg"

const options: OptionItem[] = [
  { title: "首页卡片设置", icon: SettingIcon, to: "/setting/pages/index-card/index", size: "lg" },
  { title: "大物实验平台绑定设置", icon: SettingIcon, to: "/setting/pages/lab-bind/index", size: "lg" },
  { title: "课表页设置", icon: SettingIcon, to: "/setting/pages/class-table/index", size: "lg" },
]

export default function Index() {
  return (
    <Page>
      <PageContent fixed className="h-full">
        <View className="h-full flex flex-col gap p">
          <Card className="text-xl">
            <CardContent className="px">
              <Options items={options} />
            </CardContent>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}
