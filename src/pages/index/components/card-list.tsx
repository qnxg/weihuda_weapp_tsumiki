import type { CardItem } from "@/pages/index/components/cards"
import { View } from "@tarojs/components"
import { PullRefresh } from "@/components/pull-refresh"
import { useCardLoading } from "@/pages/index/hooks/card-loading"

/**
 * @description 带加载状态管理的卡片列表
 */
export function CardList({
  cards,
}: Readonly<{
  cards: CardItem[]
}>) {
  const { triggerRefresh } = useCardLoading()

  return (
    <PullRefresh onRefresh={triggerRefresh}>
      <View className="flex flex-col gap">
        {cards.map(card => (
          <View
            key={card.key}
            className="w-full"
          >
            {card.content}
          </View>
        ))}
      </View>
    </PullRefresh>
  )
}
