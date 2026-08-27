import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import Taro, { showToast } from "@tarojs/taro"
import { useState } from "react"
import { useTyping } from "@/about/pages/index/hooks/typing"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { ABOUT_DEFAULTS } from "@/config/about"
import { useRequest } from "@/hooks/request"
import CreditIcon from "@/static/about/index/credit.svg"
import DisclaimersIcon from "@/static/about/index/disclaimers.svg"
import HomepageIcon from "@/static/about/index/homepage.svg"
import LogoIcon from "@/static/about/index/icon.svg"
import JoinIcon from "@/static/about/index/join.svg"
import VersionIcon from "@/static/about/index/version.svg"
import { od } from "@/utils/ohday"
import "./index.scss"

export default function Index() {
  const version = Taro.getAccountInfoSync().miniProgram.version

  const { data } = useRequest(() => api.about())

  const slogans = data?.slogans?.length ? data.slogans : ABOUT_DEFAULTS.slogans
  const [index, setIndex] = useState(0)
  const slogan = slogans[index % slogans.length]
  const { displayed } = useTyping(slogan, {
    initialDelay: 5,
    typingSpeed: 100,
    deletingSpeed: 50,
  })

  const handleClick = () => {
    setIndex(p => p + 1)
  }

  const handleOpenLink = (_url: string) => {
    void showToast({
      title: "即将跳转",
      icon: "success",
    })
  }

  const options: OptionItem[] = [
    { title: "当前版本", icon: VersionIcon, content: version, size: "lg" },
    { title: "开源致谢", icon: CreditIcon, to: "/about/pages/credit/index", size: "lg" },
    { title: "免责声明", icon: DisclaimersIcon, to: "/about/pages/disclaimers/index", size: "lg" },
    { title: "官网", icon: HomepageIcon, onClick: () => handleOpenLink(ABOUT_DEFAULTS.home), size: "lg" },
    { title: "招新", icon: JoinIcon, onClick: () => handleOpenLink(ABOUT_DEFAULTS.join), size: "lg" },
  ]

  return (
    <Page>
      <PageContent fixed className="h-full">
        <View className="h-full flex flex-col gap px">
          <View className="flex-1 flex flex-col gap-3xl center">
            <Icon
              src={LogoIcon}
              className="h-l-sm"
            />
            <View className="flex flex-col gap center">
              <View
                className="flex gap-xs text-highlight text-lg text-bold"
                onClick={handleClick}
              >
                <View style={{ animation: "rockLeft 3s ease-in-out infinite" }}>&lt;</View>
                {" "}
                {displayed}
                {" "}
                <View style={{ animation: "rockRight 3s ease-in-out infinite" }}>/&gt;</View>
              </View>
              <View className="text-primary text-xl text-bold">易千网络文化工作室</View>
            </View>
          </View>

          <Card className="text-xl">
            <CardContent className="px">
              <Options items={options} />
            </CardContent>
          </Card>

          <View className="flex flex-col items-center justify-end gap py-3xl">
            <View className="flex center text-muted">
              Version
              {" "}
              {version}
            </View>
            <View className="flex center text-muted">
              Copyright
              {" "}
              &copy;
              {" "}
              {`2017-${od().year}`}
              {" "}
              易千
            </View>
          </View>
        </View>
      </PageContent>
    </Page>
  )
}
