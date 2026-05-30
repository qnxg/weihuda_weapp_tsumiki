import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"
import { navigate } from "@/utils/navigate"

export interface Item {
  title: string
  icon: string
  to: string
}

export function Section({
  title,
  items,
}: Readonly<{
  title: string
  items: Item[]
}>) {
  return (
    <View className="p bg flex flex-col rounded-sm">
      <View className="text-lg">
        {title}
      </View>
      <View
        className="gap"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {items.map(item => (
          <View
            key={item.title}
            className="flex flex-col items-center"
            onClick={() => navigate(item.to)}
          >
            <Icon
              className="size"
              src={item.icon}
            />
            <View>{item.title}</View>
          </View>
        ))}
      </View>
    </View>
  )
}
