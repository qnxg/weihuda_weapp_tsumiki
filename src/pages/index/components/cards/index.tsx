import type { ReactNode } from "react"

import { Campus } from "@/pages/index/components/cards/campus"
import { CountDown } from "@/pages/index/components/cards/count-down"
import { Courses } from "@/pages/index/components/cards/courses"
import { Electricity } from "@/pages/index/components/cards/electricity"
import { Email } from "@/pages/index/components/cards/email"
import { Grade } from "@/pages/index/components/cards/grade"
import { Jifen } from "@/pages/index/components/cards/jifen"
import { Tasks } from "@/pages/index/components/cards/tasks"

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
  { name: "近期待办", key: "tasks", content: <Tasks cardKey="tasks" /> },
  { name: "假期倒计时", key: "count_down", content: <CountDown cardKey="count_down" /> },
  { name: "校园邮箱", key: "email", content: <Email cardKey="email" /> },
  { name: "成绩查询", key: "grade", content: <Grade cardKey="grade" /> },
]
