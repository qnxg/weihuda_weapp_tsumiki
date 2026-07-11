import type { OhDay } from "@twisuki/ohday"
import type { ExamScheduleItem } from "@/apis/models/exam"
import { Picker, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { FONT_COLOR } from "@/config/color"
import NextIcon from "@/static/tools/exam/exam-arrange/next.svg"
import PrevIcon from "@/static/tools/exam/exam-arrange/prev.svg"
import { ExamCard } from "@/tools/pages/exam/exam/components/exam-card"
import { cn } from "@/utils/cn"
import { od } from "@/utils/ohday"

export function Calender({
  exams,
  onShowDetail,
}: Readonly<{
  exams: ExamScheduleItem[] | null
  onShowDetail: (exam: ExamScheduleItem) => void
}>) {
  // YYYY-MM-DD 格式的日期字符串
  const [date, setDate] = useState(() => od().p("YYYY-MM-DD"))

  const days: OhDay[] = useMemo(() => {
    const monthStart = od(date).cs("M")
    const start = monthStart.sub("d", monthStart.day)
    const monthEnd = od(date).ce("M")
    const end = monthEnd.add("d", 6 - monthEnd.day)

    const days: OhDay[] = []
    for (let day = start; day.le(end); day = day.add("d", 1)) {
      days.push(day)
    }

    return days
  }, [date])

  const todayExams = useMemo(() => exams
    ? exams.filter(item => item.date && od(item.date).eq(od(date), "d"))
    : [], [exams, date])

  return (
    <View className="flex flex-col gap p">
      <Card>
        <CardContent className="flex flex-col gap">
          <View className="flex items-center justify-between">
            <Icon
              style={{
                width: "48rpx",
                height: "48rpx",
              }}
              src={PrevIcon}
              onClick={() => setDate(prev => od(prev).sub("M", 1).p("YYYY-MM-DD"))}
            />

            <View className="flex-1">
              <Picker
                mode="date"
                fields="month"
                value={date}
                onChange={(e) => {
                  const newDate = od(e.detail.value, "YYYY-MM")
                  setDate(newDate.p("YYYY-MM-DD"))
                }}
              >
                <View className="flex center text-xl text-bold">
                  {od(date).p("YYYY-MM")}
                </View>
              </Picker>
            </View>

            <Icon
              style={{
                width: "48rpx",
                height: "48rpx",
              }}
              src={NextIcon}
              onClick={() => setDate(prev => od(prev).add("M", 1).p("YYYY-MM-DD"))}
            />
          </View>

          <View
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {/* 日显示条 */}
            {(["日", "一", "二", "三", "四", "五", "六"] as const).map(item => (
              <View
                key={item}
                className="size-xs flex center text-toned"
              >
                {item}
              </View>
            ))}

            {days.map(day => (
              <View
                key={day.p("YYYY-MM-DD")}
                className={cn(
                  "relative size-xs flex center rounded-sm",
                  day.eq(od(date), "M") ? "text-hightlight" : "text-toned",
                  day.eq(od(date), "d") ? "bg-primary text-reverse" : "",
                )}
                onClick={() => setDate(day.p("YYYY-MM-DD"))}
              >
                {day.date}

                {/* 当日有考试标记 */}
                {exams?.some(item => item.date && od(item.date).eq(day, "d")) && (
                  <View
                    className="absolute rounded-full"
                    style={{
                      width: "32rpx",
                      height: "4rpx",
                      bottom: "16rpx",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: FONT_COLOR[1],
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {todayExams.map((item, index) => (
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
