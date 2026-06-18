import type { CardItem } from "@/pages/index/components/cards"
import { View } from "@tarojs/components"
import { Setting } from "@/pages/index/components/setting"

/**
 * @description 带加载状态管理的卡片列表
 */
export function CardList({
  cards,
}: Readonly<{
  cards: CardItem[]
}>) {
  return (
    <View className="flex flex-col gap p">
      {cards.map(card => (
        <View
          key={card.key}
          className="w-full"
        >
          {card.content}
        </View>
      ))}
      <Setting />
    </View>
  )
}
