import type { ReactNode } from "react"
import type { CardMeta } from "@/config/card"

import { CARD_METAS } from "@/config/card"
import { CampusCard } from "@/pages/index/components/cards/campus-card"
import { CountDown } from "@/pages/index/components/cards/count-down"
import { Courses } from "@/pages/index/components/cards/courses"
import { Electricity } from "@/pages/index/components/cards/electricity"
import { Email } from "@/pages/index/components/cards/email"
import { Grade } from "@/pages/index/components/cards/grade"
import { Jifen } from "@/pages/index/components/cards/jifen"
import { Netflow } from "@/pages/index/components/cards/netflow"
import { Tasks } from "@/pages/index/components/cards/tasks"

export interface CardItem extends CardMeta {
  content: ReactNode
}

// 各卡片 key 到渲染内容的映射, key / name 元数据统一由 @/config/card 维护
const CARD_CONTENTS: Record<string, ReactNode> = {
  jifen: <Jifen cardKey="jifen" />,
  courses: <Courses cardKey="courses" />,
  netflow: <Netflow cardKey="netflow" />,
  electricity: <Electricity cardKey="electricity" />,
  campus_card: <CampusCard cardKey="campus_card" />,
  tasks: <Tasks cardKey="tasks" />,
  count_down: <CountDown cardKey="count_down" />,
  email: <Email cardKey="email" />,
  grade: <Grade cardKey="grade" />,
}

export const cards: CardItem[] = CARD_METAS.map(meta => ({
  ...meta,
  content: CARD_CONTENTS[meta.key],
}))
