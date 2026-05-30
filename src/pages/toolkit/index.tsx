import type { Item } from "@/pages/toolkit/components/section"
import { View } from "@tarojs/components"
import { Page, PageContent } from "@/components/page"

import { Section } from "@/pages/toolkit/components/section"
import CalendarIcon from "@/static/toolkit/campus/calendar.svg"
import CardBillIcon from "@/static/toolkit/campus/card-bill.svg"
import ElectricityIcon from "@/static/toolkit/campus/electricity.svg"
import EmptyRoomIcon from "@/static/toolkit/campus/empty-room.svg"
import NetworkBillIcon from "@/static/toolkit/campus/network-bill.svg"
import NetworkDetailIcon from "@/static/toolkit/campus/network-detail.svg"
import PhysicalStandardIcon from "@/static/toolkit/campus/physical-standard.svg"
import CustomExamIcon from "@/static/toolkit/exam/custom-exam.svg"
import ExamArrangeIcon from "@/static/toolkit/exam/exam-arrange.svg"
import ExperimentArrangeIcon from "@/static/toolkit/exam/experiment-arrange.svg"
import PhysicalAppointIcon from "@/static/toolkit/exam/physical-appoint.svg"
import ExperimentGradeIcon from "@/static/toolkit/grade/experiment-grade.svg"
import GradeIcon from "@/static/toolkit/grade/grade.svg"
import PhysicalGradeIcon from "@/static/toolkit/grade/physical-grade.svg"
import RankingIcon from "@/static/toolkit/grade/ranking.svg"

interface SectionItem {
  title: string
  items: Item[]
}

const sections: SectionItem[] = [
  {
    title: "成绩与排名",
    items: [
      { title: "成绩查询", icon: GradeIcon, to: "/tools/pages/grade/grade/index" },
      { title: "成绩排名", icon: RankingIcon, to: "/tools/pages/grade/ranking/index" },
      { title: "实验成绩", icon: ExperimentGradeIcon, to: "/tools/pages/grade/experiment-grade/index" },
      { title: "体测成绩", icon: PhysicalGradeIcon, to: "/tools/pages/grade/physical-grade/index" },
    ],
  },
  {
    title: "课程与考试",
    items: [
      { title: "实验安排", icon: ExperimentArrangeIcon, to: "/tools/pages/exam/experiment-arrange/index" },
      { title: "考试安排", icon: ExamArrangeIcon, to: "/tools/pages/exam/exam-arrange/index" },
      { title: "体测预约", icon: PhysicalAppointIcon, to: "/tools/pages/exam/physical-appoint/index" },
      { title: "自定义考试", icon: CustomExamIcon, to: "/tools/pages/exam/custom-exam/index" },
    ],
  },
  {
    title: "校园与生活",
    items: [
      { title: "校历查看", icon: CalendarIcon, to: "/tools/pages/campus/calender/index" },
      { title: "体测标准", icon: PhysicalStandardIcon, to: "/tools/pages/campus/physical-standard/index" },
      { title: "空教室查询", icon: EmptyRoomIcon, to: "/tools/pages/campus/empty-room/index" },
      { title: "校园卡账单", icon: CardBillIcon, to: "/tools/pages/campus/card-bill/index" },
      { title: "校园网账单", icon: NetworkBillIcon, to: "/tools/pages/campus/netflow-bill/index" },
      { title: "流量详情", icon: NetworkDetailIcon, to: "/tools/pages/campus/netflow-detail/index" },
      { title: "电费查询", icon: ElectricityIcon, to: "/tools/pages/campus/electricity/index" },
    ],
  },
]

export default function Toolkit() {
  return (
    <Page>
      <PageContent>
        <View className="flex flex-col gap">
          {sections.map(section => (
            <Section
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}
        </View>
      </PageContent>
    </Page>
  )
}
