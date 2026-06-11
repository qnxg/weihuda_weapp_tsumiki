import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import { Card } from "@/components/card"
import { Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { useUser } from "@/hooks/user"
import DisclaimersIcon from "@/static/profile/disclaimers.svg"
import FAQIcon from "@/static/profile/faq.svg"
import FeedbackIcon from "@/static/profile/feedback.svg"
import JifenIcon from "@/static/profile/jifen.svg"
import MessageIcon from "@/static/profile/message.svg"
import SettingIcon from "@/static/profile/setting.svg"

const options: OptionItem[] = [
  { title: "小程序设置", icon: SettingIcon, to: "/setting/pages/index/index", size: "lg" },
  { title: "消息盒子", icon: MessageIcon, to: "/pages/message/index", size: "lg" },
  { title: "积分中心", icon: JifenIcon, to: "/pages/jifen/index", size: "lg" },
  { title: "我要反馈", icon: FeedbackIcon, to: "/pages/feedback/index", size: "lg" },
  { title: "常见问题", icon: FAQIcon, to: "/pages/faq/index", size: "lg" },
  { title: "免责声明", icon: DisclaimersIcon, to: "/pages/disclaimers/index", size: "lg" },
]

export default function Profile() {
  const { user } = useUser()

  return (
    <Page>
      <PageContent>
        <View className="flex flex-col gap">
          <Card>
            <View className="flex gap">
              <View className="size-xs rounded-full bg-primary flex center text-2xl text-reverse">
                {user ? user.name.at(0) : "U"}
              </View>
              <View className="flex-1 flex flex-col justify-center gap-xs">
                <View className="text-lg text-bold">{user ? user.name : "小程序用户"}</View>
                <View className="text-toned">{user ? user.stu_id : "---"}</View>
              </View>
            </View>
          </Card>

          <Card className="text-xl">
            <View className="px">
              <Options items={options} />
            </View>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}
