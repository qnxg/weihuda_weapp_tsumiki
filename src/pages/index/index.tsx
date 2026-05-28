import { Page, PageContent } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { CardList } from "@/pages/index/components/card-list"

import { cards } from "@/pages/index/components/cards"
import { DateBar } from "@/pages/index/components/date-bar"
import { CardLoadingProvider } from "@/pages/index/contexts/card-loading"

export default function Index() {
  return (
    <Page>
      <DateBar />

      <CardLoadingProvider>
        <PageContent>
          <PullRefresh onRefresh={() => {}}>
            <CardList cards={cards} />
          </PullRefresh>
        </PageContent>
      </CardLoadingProvider>
    </Page>
  )
}
