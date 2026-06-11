import type { ReactNode } from "react"

import { CampusCard } from "@/pages/index/components/cards/campus-card"
import { CountDown } from "@/pages/index/components/cards/count-down"
import { Courses } from "@/pages/index/components/cards/courses"
import { Electricity } from "@/pages/index/components/cards/electricity"
import { Email } from "@/pages/index/components/cards/email"
import { Grade } from "@/pages/index/components/cards/grade"
import { Jifen } from "@/pages/index/components/cards/jifen"
import { Netflow } from "@/pages/index/components/cards/netflow"
import { Tasks } from "@/pages/index/components/cards/tasks"

export interface CardItem {
  name: string
  key: string
  content: ReactNode
}

export const cards: CardItem[] = [
  { name: "积分", key: "jifen", content: <Jifen cardKey="jifen" /> },
  { name: "课程", key: "courses", content: <Courses cardKey="courses" /> },
  { name: "流量", key: "netflow", content: <Netflow cardKey="netflow" /> },
  { name: "电量", key: "electricity", content: <Electricity cardKey="electricity" /> },
  { name: "校园卡余额", key: "campus_card", content: <CampusCard cardKey="campus_card" /> },
  { name: "近期待办", key: "tasks", content: <Tasks cardKey="tasks" /> },
  { name: "假期倒计时", key: "count_down", content: <CountDown cardKey="count_down" /> },
  { name: "校园邮箱", key: "email", content: <Email cardKey="email" /> },
  { name: "成绩查询", key: "grade", content: <Grade cardKey="grade" /> },
]
