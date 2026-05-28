import type { ReactNode } from "react"

import { Campus } from "@/pages/index/components/cards/campus"
import { Courses } from "@/pages/index/components/cards/courses"
import { Electricity } from "@/pages/index/components/cards/electricity"
import { Jifen } from "@/pages/index/components/cards/jifen"

export interface CardItem {
  name: string
  key: string
  content: ReactNode
}

export const cards: CardItem[] = [
  { name: "积分", key: "jifen", content: <Jifen cardKey="jifen" /> },
  { name: "课程", key: "course", content: <Courses cardKey="course" /> },
  { name: "电量", key: "electricity", content: <Electricity cardKey="electricity" /> },
  { name: "校园卡余额", key: "campus", content: <Campus cardKey="campus" /> },
]
