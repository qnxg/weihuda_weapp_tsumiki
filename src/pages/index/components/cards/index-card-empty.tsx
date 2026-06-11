import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"

export function IndexCardEmpty({
  icon,
  text,
}: Readonly<{
  icon: string
  text: string
}>) {
  return (
    <View className="w-full flex flex-col items-center gap text-md">
      <Icon className="size-sm" src={icon} />
      <View>{text}</View>
    </View>
  )
}
