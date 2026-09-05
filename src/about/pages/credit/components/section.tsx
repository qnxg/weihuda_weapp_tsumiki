import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import PackageIcon from "@/static/about/credit/package.svg"
import ScaleIcon from "@/static/about/credit/scale.svg"
import VersionIcon from "@/static/about/credit/version.svg"

export interface Item {
  title: string
  icon?: string
  description: string
  license: string
  version: string
}

export default function Section({
  title,
  items,
}: Readonly<{
  title: string
  items: Item[]
}>) {
  return (
    <View className="p flex flex-col gap">
      <View className="text-xl text-highlight text-bold">
        {title}
      </View>

      {items.map((item, index) => (
        <Card key={index}>
          <CardContent className="flex gap items-center">
            <View className="flex center">
              <Icon
                src={item.icon ?? PackageIcon}
                className="size-lg"
              />
            </View>
            <View className="flex flex-col justify-center">
              <View className="text-lg text-highlight">{item.title}</View>
              <View className="text">{item.description}</View>
              <View className="text-sm flex gap-xs items-center">
                <Icon
                  src={ScaleIcon}
                  className="size-s"
                />
                {item.license}
                {" | "}
                <Icon
                  src={VersionIcon}
                  className="size-s"
                />
                {item.version}
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}
