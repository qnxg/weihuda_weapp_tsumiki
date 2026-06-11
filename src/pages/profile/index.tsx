import type { OptionItem } from "@/components/options"
import { ScrollView, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { api } from "@/apis"
import { Card } from "@/components/card"
import { Icon } from "@/components/icon"
import { Option, Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { useRequest } from "@/hooks/request"
import { useUser } from "@/hooks/user"
import ClearIcon from "@/static/profile/clear.svg"
import DisclaimersIcon from "@/static/profile/disclaimers.svg"
import FAQIcon from "@/static/profile/faq.svg"
import FeedbackIcon from "@/static/profile/feedback.svg"
import JifenIcon from "@/static/profile/jifen.svg"
import MessageIcon from "@/static/profile/message.svg"
import SettingIcon from "@/static/profile/setting.svg"
import UnbindIcon from "@/static/profile/unbind.svg"
import dayjs from "@/utils/dayjs"
import { navigate } from "@/utils/navigate"

const options: OptionItem[] = [
  { title: "小程序设置", icon: SettingIcon, to: "/setting/pages/index/index", size: "lg" },
  { title: "消息盒子", icon: MessageIcon, to: "/pages/message/index", size: "lg" },
  { title: "我要反馈", icon: FeedbackIcon, to: "/pages/feedback/index", size: "lg" },
  { title: "常见问题", icon: FAQIcon, to: "/pages/faq/index", size: "lg" },
  { title: "免责声明", icon: DisclaimersIcon, to: "/pages/disclaimers/index", size: "lg" },
]

export default function Profile() {
  const { user } = useUser()
  const { data: jifenData } = useRequest(() => api.jifen.get())

  return (
    <Page>
      <PageContent>
        <ScrollView
          scrollY
          enhanced
          showScrollbar={false}
          className="h-full"
        >
          <View className="h-full flex flex-col gap">
            <Card>
              <View className="flex gap p">
                <View className="size-xs rounded-full bg-primary flex center text-2xl text-reverse">
                  {user ? user.name.at(0) : "U"}
                </View>
                <View className="flex-1 flex flex-col justify-center gap-xs">
                  <View className="text-lg text-bold">{user ? user.name : "小程序用户"}</View>
                  <View className="text-toned">{user ? user.stu_id : "---"}</View>
                </View>
              </View>
            </Card>

            <Card>
              <View className="flex center gap">
                <View className="w-2xl h-xl flex flex-col center">
                  <View className="size-xs flex center text-2xl bold">{jifenData?.jifen ?? "--"}</View>
                  <View>当前积分</View>
                </View>

                <View className="h-xl bg-page" style={{ width: "6rpx" }} />

                <View className="w-2xl h-xl flex flex-col center">
                  <View className="size-xs flex center text-2xl bold">{jifenData?.combo ?? "--"}</View>
                  <View>连续签到</View>
                </View>

                <View className="h-xl bg-page" style={{ width: "6rpx" }} />

                <View
                  className="w-2xl h-xl flex flex-col center"
                  onClick={() => navigate("/pages/jifen/index")}
                >
                  <View className="size-xs flex center">
                    <Icon
                      style={{
                        width: "48rpx",
                        height: "48rpx",
                      }}
                      src={JifenIcon}
                    />
                  </View>
                  <View>积分中心</View>
                </View>
              </View>
            </Card>

            <Card className="text-xl">
              <View className="px">
                <Options items={options} />
              </View>
            </Card>

            <Card className="text-xl">
              <View className="px">
                <Options>
                  <Option
                    title="清除缓存"
                    icon={ClearIcon}
                    size="lg"
                  />
                  <Option
                    title="解除绑定"
                    icon={UnbindIcon}
                    size="lg"
                  />
                </Options>
              </View>
            </Card>

            <View className="flex flex-col center gap">
              <View className="flex center text-muted">
                Version
                {" "}
                {Taro.getAppBaseInfo().version}
              </View>
              <View className="flex center text-muted">
                Copyright
                {" "}
                &copy;
                {" "}
                {`2017-${dayjs().year()}`}
                {" "}
                易千
              </View>
            </View>
          </View>
        </ScrollView>
      </PageContent>
    </Page>
  )
}
