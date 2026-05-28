import type { CardItem } from "@/pages/index/components/card-list"
import { Page, PageContent } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { CardList } from "@/pages/index/components/card-list"
import { Campus } from "@/pages/index/components/cards/campus"
import { Courses } from "@/pages/index/components/cards/courses"
import { Electricity } from "@/pages/index/components/cards/electricity"
import { Jifen } from "@/pages/index/components/cards/jifen"
import { DateBar } from "@/pages/index/components/date-bar"

export default function Index() {
  const cards: CardItem[] = [
    { name: "积分", key: "jifen", content: <Jifen /> },
    { name: "课程", key: "course", content: <Courses /> },
    { name: "电量", key: "electricity", content: <Electricity /> },
    { name: "校园卡余额", key: "campus", content: <Campus /> },
  ]

  return (
    <Page>
      <DateBar />
      <PageContent>
        <PullRefresh onRefresh={() => {}}>
          <CardList cards={cards} />
        </PullRefresh>
      </PageContent>
    </Page>
  )
}
