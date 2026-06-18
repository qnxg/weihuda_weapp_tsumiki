import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import Taro, { clearStorageSync, reLaunch } from "@tarojs/taro"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Option, Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { useRequest } from "@/hooks/request"
import { useUser } from "@/hooks/user"
import ClearIcon from "@/static/profile/clear.svg"
import DisclaimersIcon from "@/static/profile/disclaimers.svg"
import FeedbackIcon from "@/static/profile/feedback.svg"
import JifenIcon from "@/static/profile/jifen.svg"
import MessageIcon from "@/static/profile/message.svg"
import SettingIcon from "@/static/profile/setting.svg"
import UnbindIcon from "@/static/profile/unbind.svg"
import dayjs from "@/utils/dayjs"
import { navigate } from "@/utils/navigate"
import { clearAllStorage } from "@/utils/storage"

const options: OptionItem[] = [
  { title: "小程序设置", icon: SettingIcon, to: "/setting/pages/index/index", size: "lg" },
  { title: "消息盒子", icon: MessageIcon, to: "/pages/message/index", size: "lg" },
  { title: "我要反馈", icon: FeedbackIcon, to: "/pages/feedback/index", size: "lg" },
  { title: "免责声明", icon: DisclaimersIcon, to: "/pages/disclaimers/index", size: "lg" },
]

export default function Profile() {
  const { user } = useUser()
  const { data: jifenData } = useRequest(() => api.jifen.get())

  const handleClearCache = async () => {
    const res = await Taro.showModal({
      title: "确认清除",
      content: "清除后将自动返回首页",
      confirmColor: "#ff5555",
      cancelColor: "#328ccb",
    })
    if (res.confirm) {
      clearAllStorage()
      await Taro.showToast({
        title: "清除成功",
      })
      await reLaunch({
        url: "/pages/index/index",
      })
    }
  }

  const handleUnBind = async () => {
    const res = await Taro.showModal({
      title: "确认解绑",
      content: "解绑后会情况全部缓存, 并要求重新登录",
      confirmColor: "#ff5555",
      cancelColor: "#328ccb",
    })
    if (res.confirm) {
      clearStorageSync()
      await Taro.showToast({
        title: "清除成功",
      })
      await reLaunch({
        url: "/pages/index/index",
      })
    }
  }

  return (
    <Page>
      <PageContent fixed className="h-full">
        <View className="h-full flex flex-col gap p">
          <Card>
            <CardContent className="flex gap p">
              <View className="size-sm rounded-full bg-primary flex center text-2xl text-reverse">
                {user ? user.name.at(0) : "U"}
              </View>
              <View className="flex-1 flex flex-col justify-center gap-xs">
                <View className="text-xl text-bold">{user ? user.name : "小程序用户"}</View>
                <View className="text-toned">{user ? user.stu_id : "---"}</View>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex center gap">
              <View className="w-2xl h-md flex flex-col center">
                <View className="size-xs flex center text-2xl bold">{jifenData?.jifen ?? "--"}</View>
                <View>当前积分</View>
              </View>

              <View className="h-md bg-page" style={{ width: "6rpx" }} />

              <View className="w-2xl h-md flex flex-col center">
                <View className="size-xs flex center text-2xl bold">{jifenData?.combo ?? "--"}</View>
                <View>连续签到</View>
              </View>

              <View className="h-md bg-page" style={{ width: "6rpx" }} />

              <View
                className="w-2xl h-md flex flex-col center"
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
            </CardContent>
          </Card>

          <Card className="text-xl">
            <CardContent className="px">
              <Options items={options} />
            </CardContent>
          </Card>

          <Card className="text-xl">
            <CardContent className="px">
              <Options>
                <Option
                  title="清除缓存"
                  icon={ClearIcon}
                  size="lg"
                  onClick={() => handleClearCache()}
                />
                <Option
                  title="解除绑定"
                  icon={UnbindIcon}
                  size="lg"
                  onClick={() => handleUnBind()}
                />
              </Options>
            </CardContent>
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
      </PageContent>
    </Page>
  )
}
