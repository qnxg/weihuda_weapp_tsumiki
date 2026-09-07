import type { CardItem } from "@/pages/index/components/cards"

import { View } from "@tarojs/components"
import { NavBar } from "@/components/nav"
import { Page, PageContent } from "@/components/page"
import { useSetting } from "@/hooks/setting"
import { CardList } from "@/pages/index/components/card-list"
import { cards } from "@/pages/index/components/cards"
import { DateBar } from "@/pages/index/components/date-bar"
import { CardLoadingProvider } from "@/pages/index/contexts/card-loading"
import { useCardLoading } from "@/pages/index/hooks/card-loading"

function IndexContent() {
  const { settings, isLoading } = useSetting()
  const { triggerRefresh } = useCardLoading()

  const cardKeys = settings.indexCardSetting?.setting.cards ?? []
  const displayCards = cardKeys
    .map(key => cards.find(card => card.key === key))
    .filter(Boolean) as CardItem[]

  return (
    <Page>
      <DateBar />

      <PageContent
        className="h-full"
        onRefresh={triggerRefresh}
        isLoading={isLoading}
      >
        {/* 底部留白, 避免内容被悬浮导航栏遮挡 */}
        <View style={{ paddingBottom: "180rpx" }}>
          <CardList cards={displayCards} />
        </View>
      </PageContent>

      <NavBar />
    </Page>
  )
}

export default function Index() {
  return (
    <CardLoadingProvider>
      <IndexContent />
    </CardLoadingProvider>
  )
}
