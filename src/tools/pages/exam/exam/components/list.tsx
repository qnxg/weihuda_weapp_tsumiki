import type { ExamScheduleItem } from "@/apis/models/exam"
import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"
import { FONT_COLOR } from "@/config/color"
import EmptyIcon from "@/static/tools/exam/exam-arrange/empty.svg"
import { ExamCard } from "@/tools/pages/exam/exam/components/exam-card"

export function List({
  exams,
  onShowDetail,
}: Readonly<{
  exams: ExamScheduleItem[] | null
  onShowDetail: (exam: ExamScheduleItem) => void
}>) {
  if (!exams || exams.length === 0) {
    return (
      <View className="h-full flex flex-col center gap py-xl">
        <Icon className="size-xl" src={EmptyIcon} />
        <View className="text-toned">暂无考试信息</View>
      </View>
    )
  }

  return (
    <View className="flex flex-col gap p">
      {exams.map((item, index) => (
        <ExamCard
          key={`${item.course_name}-${item.customize_id}-${index}`}
          exam={item}
          color={FONT_COLOR[index % FONT_COLOR.length]}
          onClick={() => onShowDetail(item)}
        />
      ))}
    </View>
  )
}
