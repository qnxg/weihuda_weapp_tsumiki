import type { CardItem } from "@/pages/index/components/cards"
import { useEffect } from "react"

import { Page, PageContent } from "@/components/page"
import { useSetting } from "@/hooks/setting"
import { CardList } from "@/pages/index/components/card-list"
import { cards } from "@/pages/index/components/cards"
import { DateBar } from "@/pages/index/components/date-bar"
import { Setting } from "@/pages/index/components/setting"
import { CardLoadingProvider } from "@/pages/index/contexts/card-loading"

export default function Index() {
  const { settings, isLoading } = useSetting()

  useEffect(() => {
    console.log(settings)
  }, [settings])

  const cardKeys = settings.indexCardSetting?.setting.cards ?? []
  const displayCards = cardKeys
    .map(key => cards.find(card => card.key === key))
    .filter(Boolean) as CardItem[]

  return (
    <Page isLoading={isLoading}>
      <DateBar />

      <CardLoadingProvider>
        {(settings.indexCardSetting?.setting.cards) && (
          <PageContent>
            <CardList cards={displayCards} />
            <Setting />
          </PageContent>
        )}
      </CardLoadingProvider>
    </Page>
  )
}
