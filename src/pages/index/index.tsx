import { Page, PageContent } from "@/components/page"
import { CardList } from "@/pages/index/components/card-list"

import { cards } from "@/pages/index/components/cards"
import { DateBar } from "@/pages/index/components/date-bar"
import { Setting } from "@/pages/index/components/setting"
import { CardLoadingProvider } from "@/pages/index/contexts/card-loading"

export default function Index() {
  return (
    <Page>
      <DateBar />

      <CardLoadingProvider>
        <PageContent>
          <CardList cards={cards} />
          <Setting />
        </PageContent>
      </CardLoadingProvider>
    </Page>
  )
}
