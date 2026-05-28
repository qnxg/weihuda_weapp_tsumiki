import type { ReactNode } from "react"
import { View } from "@tarojs/components"

export interface CardItem {
  name: string
  key: string
  content: ReactNode
}

export function CardList({
  cards,
}: Readonly<{
  cards: CardItem[]
}>) {
  return (
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
  )
}
