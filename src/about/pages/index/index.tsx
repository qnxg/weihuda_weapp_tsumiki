import type { OptionItem } from "@/components/options"
import { Image, View } from "@tarojs/components"
import Taro, { setClipboardData } from "@tarojs/taro"
import { useState } from "react"
import { useTyping } from "@/about/pages/index/hooks/typing"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { ABOUT_DEFAULTS } from "@/config/about"
import { useQuery } from "@/hooks/request"
import BrandIcon from "@/static/about/index/brand.svg"
import CreditIcon from "@/static/about/index/credit.svg"
import DisclaimersIcon from "@/static/about/index/disclaimers.svg"
import HomepageIcon from "@/static/about/index/homepage.svg"
import JoinIcon from "@/static/about/index/join.svg"
import LogoIcon from "@/static/about/index/logo.jpg"
import VersionIcon from "@/static/about/index/version.svg"
import { showModal } from "@/utils/modal"
import { od } from "@/utils/ohday"
import "./index.scss"

export default function Index() {
  const version = Taro.getAccountInfoSync().miniProgram.version

  const { data } = useQuery(() => api.about())

  const slogans = data?.slogans?.length ? data.slogans : ABOUT_DEFAULTS.slogans
  const home = data?.home || ABOUT_DEFAULTS.home
  const join = data?.join || ABOUT_DEFAULTS.join

  const [index, setIndex] = useState(0)
  const slogan = slogans[index % slogans.length]
  const { displayed } = useTyping(slogan, {
    initialDelay: 5,
    typingSpeed: 100,
    deletingSpeed: 50,
  })

  const { displayed: author } = useTyping("Powered by 易千网络文化工作室 {♡;}", {
    initialDelay: 30,
    typingSpeed: 75,
  })

  const handleClick = () => {
    setIndex(p => p + 1)
  }

  const handleOpenLink = async (title: string, url: string) => {
    await setClipboardData({ data: url })
    void showModal(title, "链接已复制, 请粘贴到浏览器打开")
  }

  const options: OptionItem[] = [
    { title: "当前版本", icon: VersionIcon, content: version, size: "lg" },
    { title: "开源致谢", icon: CreditIcon, to: "/about/pages/credit/index", size: "lg" },
    { title: "免责声明", icon: DisclaimersIcon, to: "/about/pages/disclaimers/index", size: "lg" },
    { title: "官网", icon: HomepageIcon, onClick: () => void handleOpenLink("易千官网", home), size: "lg" },
    { title: "招新", icon: JoinIcon, onClick: () => void handleOpenLink("易千招新", join), size: "lg" },
  ]

  return (
    <Page>
      <PageContent fixed className="h-full">
        <View className="h-full flex flex-col gap px">
          <View className="flex-1 flex flex-col gap-3xl center">
            <View className="p-3xl">
              <View className="logo-glow rounded-xl">
                <Image
                  src={LogoIcon}
                  className="size-l-xl rounded-xl"
                  style={{
                    display: "block",
                  }}
                />
              </View>
            </View>

            <View className="flex flex-col gap center">
              <View className="text-primary text-3xl text-bold">湖南大学微生活</View>
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
              <View className="text-highlight">{author || "\u00A0"}</View>
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
              <Icon
                src={BrandIcon}
                className="h-s-xs w-m-xl"
              />
              易千
            </View>
          </View>
        </View>
      </PageContent>
    </Page>
  )
}
