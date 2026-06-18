import type { CardItem } from "@/pages/index/components/cards"

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
    <Page isLoading={isLoading}>
      <DateBar />

      <PageContent className="h-full" onRefresh={triggerRefresh}>
        <CardList cards={displayCards} />
      </PageContent>
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
